import express from "express";

import {
  getMe,
  onlineUsers,
  getUsers,
  getMessages,
  clearMessages,
  getMedia,
  updateUser,
} from "../controller/actionController";

import { createGroup } from "../controller/groupController";

const router = express.Router();

//groups
router.post("/group", createGroup);

//chats
router.get("/me", getMe);
router.get("/users", getUsers);
router.get("/online", onlineUsers);
router.post("/messages", getMessages);
router.post("/media", getMedia);
router.post("/updateUser", updateUser);
router.post("/clearMessages", clearMessages);

router.get("/allUser", getUsers);

export default router;
