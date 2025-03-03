import express from "express";

import {
  getMe,
  onlineUsers,
  getUsers,
  getMessages,
  clearMessages,
  getMedia,
} from "../controller/actionController";

const router = express.Router();

router.get("/me", getMe);
router.get("/online", onlineUsers);
router.post("/messages", getMessages);
router.post("/media", getMedia);
router.post("/clearMessages", clearMessages);

router.get("/allUser", getUsers);

export default router;
