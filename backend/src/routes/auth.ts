import express from "express";
import passport from "passport";
import { registerUser,loginUser, logout, getMe, onlineUsers } from '../controller/authController';

const router = express.Router();



// router.post('/SignUp',registerUser);
router.post("/SignUp", registerUser);
router.post("/login", loginUser);
router.post("/logout",logout);
router.get("/me",getMe);
router.get("/online",onlineUsers);



export default router;
