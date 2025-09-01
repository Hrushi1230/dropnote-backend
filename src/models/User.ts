import {Schema , model ,Document, Types} from "mongoose";

export interface IUser extends Document {
    email:string;
    passwordHash :string;
    lastDropISO?:string|null;
    lastReceivedISO?:string|null;
    receivedNoteId?:Types.ObjectId|null;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type:String,
            required: true,
            unique :true,
            index :true
        },
        passwordHash :{
            type :String,
            required:true
        },
        lastDropISO :{
            type:String,
            default :null
        },
        lastReceivedISO :{
            type : String,
            default:null
        },
        receivedNoteId:{
            type:Schema.Types.ObjectId,
            ref:"Note",
            default:null
        },
    },
    {
        timestamps:true
    }
);

export const User =model<IUser>("user" , UserSchema);