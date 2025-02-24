import ensureAuthenticated from "./routes/authEnsure";
import express from "express";

import { Request, Response } from "express";

const router = express.Router();

router.get("/auth/validate", ensureAuthenticated, (req: Request, res: Response) => {
  res.status(200).json({ message: "You are authorized" });
});

