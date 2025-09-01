import {Types ,model ,Document,Schema} from "mongoose";

export interface IReply extends Document{
    noteId:Types.ObjectId;
    senderId:Types.ObjectId;
    content:string;
    createdAt:Date;
    expiresAt:Date;
}

const ReplySchema = new Schema<IReply>(
  {
    noteId:{type:Schema.Types.ObjectId, ref:"Note",required:true,index:true},
    senderId:{type:Schema.Types.ObjectId,ref:"User",required:true,index:true},
    content:{type:String,required:true,minlength:1,maxlength:250},
    createdAt:{type:Date,default:Date.now},
    expiresAt:{type:Date,required:true,index:true},
  },
  {
    timestamps:true
  }
);

ReplySchema.index({expiresAt:1},{expireAfterSeconds:0});

export const Reply =model<IReply>("Reply",ReplySchema);