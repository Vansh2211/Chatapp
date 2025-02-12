

import express, { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, mobile, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return; // Ensure the function stops here
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, mobile, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error); // Log the actual error
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || '',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};


const tokenBlacklist = new Set<string>();

export const logout = (req: Request, res: Response): void => {
    try {
      
      res.clearCookie("jwtToken"); // Replace "token" with the name of your cookie if different
  
    
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        tokenBlacklist.add(token); 
      }
  
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
//getMe
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          res.status(401).json({ message: "Authorization header missing" });
          return;
        }
    
        const token = authHeader.split(" ")[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
    
        const user = await User.findById(decoded.id);
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }
    
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch user", error });
      }
};

//getOnline users

export const onlineUsers = (req: Request, res: Response): void => {
    try {
      res.status(200).json(onlineUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch online users", error });
    }
  };


export default router;


