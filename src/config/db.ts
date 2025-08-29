import mongoose from "mongoose";
import {ENV} from "./env"

export async function connectMongo(){
    if(mongoose.connection.readyState===1) return;

    await mongoose.connect(ENV.MONGO_URI);
    console.log("Mongo Connected");
}