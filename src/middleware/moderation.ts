import { NextFunction ,Request,Response} from "express";


const banned=["fuck","banda","sex","curse"];

export function moderateContent(req:Request ,res:Response,next:NextFunction){
    const {content} =req.body || {};
    if(typeof content === "string"){
        const lowered = content.toLowerCase();
        if (banned.some(w => lowered.includes(w))) {
            return res.status(400).json({message:"Content rejected by moderation"});
        }
    }
    next();
}  