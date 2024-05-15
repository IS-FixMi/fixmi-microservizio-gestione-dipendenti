import  express  from "express";
import PermissionLevel, { checkPermission, strToPermissionLevel } from "../enums/PermissionLevel";
import getToken from "./getToken";
import getProfileInfo from "./getProfileInfo";
import getPermission from "./getPermission";

//middleware factory for permission
//returns a middleware function that checks that the user has the necessari permission level provided
//401: missing Token
//404: no user with given Token
//403: Permission Denied!
export default function permissionCheck(level: PermissionLevel){
    return async(req,res,next) => {
        let token: string | null = null;
        try {
            token =getToken(req);
            const info = await getProfileInfo(token);
            if (!checkPermission(level, strToPermissionLevel(getPermission(info))  )   ){
                res.status(403);
                res.json({error: "Permission Denied!"});
                return;
    
            } 
        }catch(e){
            console.log("error from middleware!!!!!!!");
            console.log("error: " + JSON.stringify(e));
            res.status(e.status)
            res.json(e.error);
            return;
        }
        next()
    }
}