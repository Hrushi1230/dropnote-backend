import { Router } from "express";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { Note } from "../models/Note";
import { Reply } from "../models/Reply";
import { User } from "../models/User";




export const gdprRouter=Router();

gdprRouter.delete("/delete",requireAuth, async (req:AuthedRequest,res)=>{
    try {
        const userId =req.user!.id;

        await Note.deleteMany({$or:[{senderId:userId},{receiverId:userId}]});
        await Reply.deleteMany({senderId:userId});
        await User.deleteOne({_id:userId});

        return res.json({message:"All your data has been deleted"});
    }
    catch(e){
        console.error(e);

        return res.status(500).json({message:"Failed to delete data"});
    }
});
