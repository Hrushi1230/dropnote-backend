import { Document, Schema, Types, model } from "mongoose";

export interface INote extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  createdAt: Date;
  expiresAt: Date;
  replied: boolean;
}

const NoteSchema = new Schema<INote>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: { type: String, required: true, minlength: 1, maxlength: 250 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true},
    replied: { type: Boolean, default: false },
  },
  { timestamps: true }
);
//delete when expiresAt is reached
NoteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Note = model<INote>("Note", NoteSchema);
