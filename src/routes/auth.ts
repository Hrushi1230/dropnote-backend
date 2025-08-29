import { Router } from "express";
import { User } from "../models/User";
import { rateLimit } from "../middleware/rateLimit";
import { hashPassword, verifyPassword } from "../utils/password";
import { signJwt } from "../utils/jwt";

export const authRouter = Router();

function getIp(req: any) {
  return (
    (req.headers["x-forwarded-for"] as string) ||
    req.socket.remoteAddress ||
    "unknown"
  );
}
//for POST /api/auth/register

authRouter.post(
  "/register",
  rateLimit({ key: (req) => `reg :${getIp(req)}`, limit: 5, windowSec: 60 }),
  async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }
      const passwordHash = await hashPassword(password);
      const user = await User.create({ email, passwordHash });
      const token = signJwt({ id: user._id, email: user.email });
      res
        .status(201)
        .json({ token, user: { id: user._id, email: user.email } });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Register failed" });
    }
  }
);

authRouter.post(
  "/login",
  rateLimit({ key: (req) => `login:${getIp(req)}`, limit: 10, windowSec: 60 }),
  async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: "Invalid credentials" });

      const token = signJwt({ id: user._id, email: user.email });
      res.json({ token, user: { id: user._id, email: user.email } });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Login failed" });
    }
  }
);
