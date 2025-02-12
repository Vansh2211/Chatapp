import express from "express";
import passport from "passport";
import { registerUser,loginUser, logout, getMe, onlineUsers,getUsers, getMessages } from '../controller/authController';
import { verify } from "crypto";
import { verifyToken } from "../authMiddleware";
import ensureAuthenticated from "./authEnsure";
// import verifyToken from "../authMiddleware"

const router = express.Router();



// router.post('/SignUp',registerUser);
router.post("/SignUp", registerUser);
router.post("/login", loginUser);
router.post("/logout",logout);
router.get("/me",getMe);
router.get("/online",onlineUsers);
router.get("/message",getMessages)

router.get("/user",verifyToken,getUsers);

router.get('/validate', ensureAuthenticated, (req, res) => {
    res.json({ valid:true,message: "Welcome to the home page!" ,user:req.user});
});



export default router;
