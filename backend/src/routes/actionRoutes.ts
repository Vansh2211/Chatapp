import express from "express";

import {
  getMe,
  onlineUsers,
  getUsers,
  getMessages,
} from "../controller/actionController";

const router = express.Router();

router.get("/me", getMe);
router.get("/online", onlineUsers);
router.get("/:senderId/:receive", getMessages);

router.get("/allUser", getUsers);

export default router;
