import express from 'express'
import { db_users } from '../server';
import getMissingFields from "../utils/missingFields";
import getToken from '../utils/getToken';
import getProfileInfo from '../utils/getProfileInfo';
import JSONError from '../utils/JSONError';

import getPermission from '../utils/getPermission';

const deleteRouter = express.Router();

// Route:
// /api/dipendenti/delete
//
// method:
// DELETE
//
// description:
// method for deleting a profile, providing their email
// 
// -----------------------------------------------------------
// body / cookie:
// token
// body:
// email
// -----------------------------------------------------------
// responses:
// 200 {text: "successfully deleted the profile"}
// 400 {error: "missing fields", missingFields}
// 400 {error: "you're not the manager"}
// 404 {error: "user not found"}



deleteRouter.delete("/", async (req,res)=> {
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


    const user = await db_users.collection("users").findOne({email:fields.get("email")});
    if(user == null){
        res.status(404);
        res.json({error: "user not found"});
        return;
    }
    await db_users.collection("users").deleteOne({id: user.id});
    res.json({text: "successfully deleted the profile!"});

    

})
export default deleteRouter;