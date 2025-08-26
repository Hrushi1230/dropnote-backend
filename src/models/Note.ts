// src/models/Note.ts
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: {
     type: String, 
     required: true, 
     maxlength: 500 
    },
  authorSession: {
     type: String, 
     required: true 
    },
  assignedToSession: { 
    type: String, 
    required: false 
},
  reply: {
    content: {
         type: String
         },
    createdAt: { 
        type: Date 
    },
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: "24h" 
},
});

export default mongoose.model("Note", noteSchema);
