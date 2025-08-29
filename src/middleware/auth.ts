import {Request ,Response,NextFunction} from "express";
import {verifyJwt} from "../utils/jwt";

export interface AuthedRequest extends Request{
    user? : {
        id:string;
        email?:string;
    };
}

export function requireAuth(req:AuthedRequest , res:Response , next:NextFunction){
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer") ? auth.slice(7) : " ";
    
    if(!token){
        return res.status(401).json(
            {message :"Missing token"}
        );
    }
    try{
        const payload=verifyJwt<{
            id:string;
            email?:string
        }>(token);
        req.user = {
            id:payload.id,
            email:payload.email
        };
        return next();
    }
    catch{
     return res.status(401).json({
        message :"Invalid token"
     });
  }
}

