import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from './models/User';

interface AuthRequest extends Request {
    user?:any;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded:any = jwt.verify(token, process.env.JWT_SECRET || "");
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  };
const app = express();
const cors = require("cors");
app.use(cors());


