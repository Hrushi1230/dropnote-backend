import { Router } from "express";
import { User } from "../models/User";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { Note } from "../models/Note";
import { Reply } from "../models/Reply";
import { Types } from "mongoose";
import { moderateContent } from "../middleware/moderation";

export const notesRouter = Router();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const todayISO = () => {
  return new Date().toISOString().slice(0, 10); //YYYY-MM-DD UTC
};
//pick a random receiver who isnt the sender and hasn't received today

async function pickRandomReceiver(excludeUserId: any) {
  const iso = todayISO();
  const pipeline: any[] = [
    {
      $match: {
        _id: { $ne: excludeUserId },
        $or: [
          { lastReceivedISO: { $ne: iso } },
          { lastReceivedISO: { $exists: false } },
        ],
      },
    },
    {
      $sample: { size: 1 },
    },
  ];

  const [candidate] = await User.aggregate(pipeline);
  if (!candidate) return null;
  return await User.findById(candidate._id);
}
//POST /api/notes/drop

notesRouter.post("/drop", requireAuth,moderateContent, async (req: AuthedRequest, res) => {
  try {
    const me = await User.findById(req.user!.id);
    if (!me) return res.status(404).json({ message: "User not found" });

    const iso = todayISO();
    if (me.lastDropISO === iso) {
      return res
        .status(429)
        .json({ message: "You have already dropped a note today" });
    }

    const { content } = req.body || {};
    if (
      !content ||
      typeof content !== "string" ||
      content.length < 1 ||
      content.length > 250
    ) {
      return res
        .status(400)
        .json({ message: "Content must be a string, 1-250 chars" });
    }

    const receiver = await pickRandomReceiver(me._id);
    if (!receiver) {
      return res
        .status(409)
        .json({ message: "No available receivers found. Try again later" });
    }

    const expiresAt = new Date(Date.now() + ONE_DAY_MS);

    const note = await Note.create({
      senderId: me._id,
      receiverId: receiver._id,
      content,
      expiresAt,
    });

    // update sender
    me.lastDropISO = iso;
    await me.save();

    // update receiver
    receiver.lastReceivedISO = iso;
    receiver.receivedNoteId = note._id as Types.ObjectId;
    await receiver.save();

    return res.status(201).json({ message: "Note dropped", noteId: note._id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Drop failed" });
  }
});

//GET /api/notes/index

notesRouter.get("/inbox", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const me = await User.findById(req.user!.id);
    if (!me?.receivedNoteId) return res.json({ note: null });

    const note = await Note.findOne({
      _id: me.receivedNoteId,
      receiverId: me._id,
    });
    if (!note) return res.json({ note: null });

    return res.json({
      note: {
        id: note._id,
        content: note.content,
        createdAt: note.createdAt,
        expiresAt: note.expiresAt,
        replied: note.replied,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Inbox error" });
  }
});

//POST /api/notes/:id/reply

notesRouter.post("/:id/reply", requireAuth,moderateContent, async (req: AuthedRequest, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body || {};
    if (
      !content ||
      typeof content !== "string" ||
      content.length < 1 ||
      content.length > 250
    ) {
      return res.status(400).json({ message: "Content 1-250 chsrs required" });
    }
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (String(note.receiverId) !== String(req.user!.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (note.replied)
      return res.status(409).json({ message: "Already replied" });

    await Reply.create({
      noteId: note._id,
      senderId: note.receiverId,
      content,
      expiresAt: note.expiresAt,
    });
    note.replied = true;
    await note.save();
    return res.status(201).json({ message: "Reply sent" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Reply failed" });
  }
});
