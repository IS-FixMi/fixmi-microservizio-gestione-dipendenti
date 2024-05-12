import express from 'express'
import { db_users} from '../server';
import {ObjectId} from "mongodb";
import getMissingFields from "../utils/missingFields";
import PermissionLevel from '../enums/PermissionLevel';
import { toTaskTagArray } from '../enums/TaskTag';
import getToken from '../utils/getToken';
import getProfileInfo from '../utils/getProfileInfo';
import JSONError from '../utils/JSONError';
import { Dipendente } from '../classes/Profilo';
import getPermission from '../utils/getPermission';

const createRouter = express.Router();

// Route:
// /api/dipendenti/create
//
// method:
// POST
//
// description:
// method for creating a dipendente profile, providing email,password, name, surname, birthdate and hiring day, worktag
// 
// -----------------------------------------------------------
// body / cookie:
// token
// body:
// email, password, nome, cognome, nascita, assunzione,worktag
// -----------------------------------------------------------
// NOTES:
// - nascita and assunzione must be a date in this format: YYYY-MM-DD
// - in postman, to provide an array in www-form-urlencoded format you should write:
// key : worktag[] value: Negozio
// key: worktag[] value: Magazzino 
// -----------------------------------------------------------
// responses:
// 200 {text: "successfully created"}
// 400 {error: "missing fields", missingFields}
// 400 {error: "you're not the manager"}
// 400 {error: "invalid birth date"}
// 400 {error: "invalid assunzione date"}
// 400 {error: "no worktag array"}
// 400 {error: "elements provided are not worktags"}
// 400 {error: "user with given email already exists!"}



createRouter.post("/", async (req,res)=> {
    let fields = new Map([
        
        ["email", req.body.email],
        ["password", req.body.password],
        ["nome",req.body.nome],
        ["cognome", req.body.cognome],
        ["nascita", req.body.nascita],
        ["assunzione",req.body.assunzione],
        ["worktag", req.body.worktag],

    ]);
    let missingFields = getMissingFields(Array.from(fields.entries()))
       //missing fields: returns an error
    if(missingFields.length!=0) {
        res.status(400);
        res.json({error: "missing fields", missingFields: missingFields})
        return;
    }
    //auth
    let token: string | null = null;
    try {
        token =getToken(req);
        let info = await getProfileInfo(token);
        if (getPermission(info) != "Manager"){
            throw new JSONError("you're not the manager!! get out of here!");

        } 
    }catch(e){
        res.status(400);
        res.json(e.message);
        return;
    }
    const nascita = new Date(fields.get("nascita"));
    const assunzione = new Date(fields.get("assunzione"));
    if(isNaN(nascita.getDate())){
        res.status(400);
        res.json({error: "invalid birth date"});
        return;
    }
    if(isNaN(assunzione.getDate())){
        res.status(400);
        res.json({error: "invalid assunzione date"});
        return;
    }
    if(!Array.isArray(fields.get("worktag"))){
        res.status(400);
        res.json({error: "you haven't provided an array to worktag"})
        return;
    }
    console.log(fields.get("worktag"));
    let worktag= toTaskTagArray(fields.get("worktag"));
    if(worktag==null){
        res.status(400);
        res.json({error: "elements provided are not worktags"});
        return;
    }
    const lookupEmail = await db_users.collection("users").findOne({email:fields.get("email")});
    if(lookupEmail != null){
        res.status(400);
        res.json({error: "user with given email already exists!"});
        return;
    }
    const dipendente = new Dipendente(fields.get("email"),fields.get("password"),fields.get("nome"),fields.get("cognome"),nascita,assunzione,worktag);
    await db_users.collection("users").insertOne(dipendente);
    
    res.json({text: "successfully created a Dipendente profile!", dipendente: dipendente})
    

})

export default createRouter;