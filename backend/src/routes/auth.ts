import express from "express";
import passport from "passport";
import { registerUser, loginUser, logout } from "../controller/authController";
import { verify } from "crypto";
import { verifyToken } from "../authMiddleware";
import ensureAuthenticated from "./authEnsure";
// import verifyToken from "../authMiddleware"

const router = express.Router();

// router.post('/SignUp',registerUser);
router.post("/SignUp", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;
