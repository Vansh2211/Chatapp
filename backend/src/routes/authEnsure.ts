require("dotenv").config();
import { configDotenv } from "dotenv";
import { Request, Response, NextFunction } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  user: string | JwtPayload;
}

const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("token: ", token);

  if (!token) {
    res.status(403).json({ message: "Unauthorized JWT" });

    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    req.user = decoded;

    next();
  } catch (err) {
    console.log("error: ", err);
    res
      .status(403)
      .json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};

export default ensureAuthenticated;
