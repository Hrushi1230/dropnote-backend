// src/models/Session.ts
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: {
       type: String,
       required: true,
       unique: true
     },
  createdAt: {
      type: Date,
      default: Date.now, 
      expires: "30d" 
    }, // auto-expire
});

export default mongoose.model("Session", sessionSchema);
