import {Router} from "express";
import { requireAuth } from "../middleware/auth";


export const secureDemoRouter=Router();

secureDemoRouter.get("/",requireAuth, (req,res)=>{
   res.json({
    message:"you are authenticated!",
    user:(req as any).user
   });
});