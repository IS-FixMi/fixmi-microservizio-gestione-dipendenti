



import express from 'express'
import {db_users,db_tasks, dbg } from '../server';
import {ObjectId} from "mongodb";
import getMissingFields from "../utils/missingFields";
import PermissionLevel from '../enums/PermissionLevel';
import { toTaskTagArray } from '../enums/TaskTag';
import getToken from '../utils/getToken';
import getProfileInfo from '../utils/getProfileInfo';
import JSONError from '../utils/JSONError';
import { Dipendente } from '../classes/Profilo';
import getPermission from '../utils/getPermission';

const historyRouter = express.Router();
// Route:
// /api/dipendenti/delete
//
// method:
// POST
//
// description:
// method for getting a dipendente's task history
// 
// -----------------------------------------------------------
// body / cookie:
// token
// body:
// email
// -----------------------------------------------------------
// responses:
// 200 {[task1,task2,...]}
// 400 {error: "missing fields", missingFields}
// 400 {error: "you're not the manager"}
// 404 {error: "dipendente not found"}





historyRouter.post("/", async (req,res)=> {
    const fields = new Map([
        ["email", req.body.email],

    ]);
    const missingFields = getMissingFields(Array.from(fields.entries()))
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
        const info = await getProfileInfo(token);
        if (getPermission(info) != "Manager"){
            throw new JSONError("you're not the manager!! get out of here!");

        } 
    }catch(e){
        res.status(400);
        res.json(e.message);
        return;
    }

    const dipendente = await db_users.collection("users").findOne({email:fields.get("email")});
    
    if(dipendente == null || dipendente.permissionLevel == "Cliente"){
        res.status(404);
        res.json({error: "dipendente not found"});
        return;
    }    
    const history = await executeQuery(dipendente.id,PermissionLevel.Dipendente);
    res.json({history: history});



})

export default historyRouter;



// Query the DB
async function executeQuery(profileId, permission) {

    dbg("Executing query", "");
   
    // The manager can see all the tasks in lavorazione
    if (permission == 'Manager') {
    
      return db_tasks.collection("tasks")
          .find({ taskStatus: 'Completata' })
          .toArray();
    }
    
    return db_tasks.collection("tasks")
        .find({ 'taskStatus': 'Completata', 'assignedTo': profileId })
        .toArray();
}
 