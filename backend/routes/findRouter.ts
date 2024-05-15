import express from 'express'
import {  db_users } from '../server';
import {ObjectId} from "mongodb";
import getMissingFields from "../utils/missingFields";
import PermissionLevel from '../enums/PermissionLevel';
import { toTaskTagArray } from '../enums/TaskTag';
import getToken from '../utils/getToken';
import getProfileInfo from '../utils/getProfileInfo';
import JSONError from '../utils/JSONError';
import { Dipendente } from '../classes/Profilo';
import getPermission from '../utils/getPermission';
import permissionCheck from '../utils/permissionMiddleware';

const findRouter = express.Router();


// Route:
// /api/dipendenti/find
//
// method:
// POST
//
// description:
// method for searching user profiles
// 
// -----------------------------------------------------------
// body / cookie:
// token
// body:
// required: mode 
// optional: email, password, nome, cognome, nascita, assunzione,worktag
// -----------------------------------------------------------
// NOTES:
// - nascita and assunzione must be a date in this format: YYYY-MM-DD
// - mode field must be either "one" or "many"
// - specify only the fields you want to search for e.g. specify email if you're looking for a profile with that given email
// - in postman, to provide an array in www-form-urlencoded format you should write:
// key : worktag[] value: Negozio
// key: worktag[] value: Magazzino 
//
// -----------------------------------------------------------
// responses:
// 200 {user} if mode = one
// 200 {users: []} if mode = many
// 401 {error: "missing Token"}
// 403 {error: "Permission denied!"}
// 404 {error: "user not found with the given token"}
// 400 {error: "missing fields", missingFields}
// 400 {error: "invalid birth date"}

// 404{error: "user not found!"} if mode = one




findRouter.use(permissionCheck(PermissionLevel.Manager));
findRouter.post("/", async (req,res)=> {
    const fields = new Map([
        ["mode", req.body.mode],

    ]);
    const missingFields = getMissingFields(Array.from(fields.entries()))
       //missing fields: returns an error
    if(missingFields.length!=0) {
        res.status(400);
        res.json({error: "missing fields", missingFields: missingFields})
        return;
    }
    //auth
    /*
    let token: string | null = null;
    try {
        token =getToken(req);
        const info = await getProfileInfo(token);
        if (getPermission(info) != "Manager"){
            throw new JSONError("you're not the manager!! get out of here!");

        } 
    }catch(e){
        res.status(400);
        res.json(e.message);
        return;
    }
    */
    const schema = removeBlankAttributes({
        email: req.body.email,
        nome: req.body.nome,
        cognome: req.body.cognome,
        dataDiNascita: req.body.nascita,
        dataDiAssunzione: req.body.assunzione,
        workTags: req.body.worktag,
        permissionLevel:req.body.permissionLevel
    });
    if( fields.get("mode") == "one"){
        const user = await db_users.collection("users").findOne(schema);
        if(user == null){
            res.status(404);
            res.json({error:"user not found", search_criteria: schema});
            return;
        }
        res.json({user: user});
        return;
    }
    if(fields.get("mode") == "many"){
        const user = await db_users.collection("users").find(schema).toArray();
        res.json({users: user});
        return;
    }
    //mode is not one or many
    if(fields["mode"] != "one" || fields["mode"] != "many"){
    res.status(400);
    res.json({error: "mode field must be 'one' or 'many' "});
}   



})
export default findRouter;


function removeBlankAttributes(obj) {
    const result = {};
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}