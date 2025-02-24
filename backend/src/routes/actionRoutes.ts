import express from "express";
import passport from "passport";
import {
  getMe,
  onlineUsers,
  getUsers,
  getMessages,
} from "../controller/actionController";
import { verify } from "crypto";
import { verifyToken } from "../authMiddleware";
import ensureAuthenticated from "../routes/authEnsure";

const router = express.Router();

router.get("/me", getMe);
router.get("/online", onlineUsers);
router.get("/:senderId/:receiverId", getMessages);

router.get("/allUser", getUsers);

export default router;
