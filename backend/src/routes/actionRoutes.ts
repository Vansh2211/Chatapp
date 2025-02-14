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
import ensureAuthenticated from "/Users/juntrax/Desktop/Chatapp/backend/src/routes/authEnsure";

const router = express.Router();

router.get("/me", getMe);
router.get("/online", ensureAuthenticated, onlineUsers);
router.get("/message", getMessages);

router.get("/allUser", getUsers);

export default router;
