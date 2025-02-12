
import mongoose from "mongoose";
import express, { Request, Response,NextFunction } from 'express';
// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Message from "/Users/juntrax/Desktop/Chatapp/backend/src/models/message";

const router = express.Router();

// interface custom extends Request{
//   user?:{
//     id:string;
//     name: string;
//     email: string;
//     password: string;
//     mobile:number;
//   }
// }



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

        res.status(201).json({ message: 'User created successfully', user: newUser});
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
            { expiresIn: '9h' }
        );

        // localStorage.setItem(
        //   "user",
        //   JSON.stringify({ name: user.name, email: user.email })
        // );
        


        res.status(200).json({ message: 'Login successful', token ,name:user.name, email:user.email, mobile:user.mobile});
        
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }

    
};


const tokenBlacklist = new Set<string>();

export const logout = (req: Request, res: Response): void => {
    try {
      
      res.clearCookie("jwtToken"); 
  
    
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

export const getUsers = async (req: Request, res: Response):Promise<void> => {
  try {
    const { name, email, mobile, password } = req.user as IUser // Access the user from the request object
    if (!req.user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    console.log(name);
    console.log(email)
    res.status(200).json({ message: 'User found', name });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};



//getOnline users

const onlineUsersSet = new Set<string>(); // Store online users' IDs

export const onlineUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401).json({ message: "Authorization header missing hai" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string };

    onlineUsersSet.add(decoded.id); // Add user ID to online users set

    // Fetch user details for all online users
    const users = await User.find({ _id: { $in: Array.from(onlineUsersSet) } }).select(
      "name email mobile"
    );

    res.status(200).json({ message: "Online users retrieved", onlineUsers: users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch online users", error });
  }

  
};


export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
      const { senderId, receiverId } = req.params;

      if (!senderId || !receiverId) {
          res.status(400).json({ message: "Sender and receiver IDs are required" });
          return;
      }

      const messages = await Message.find({
          $or: [
              { sender: senderId, receiver: receiverId },
              { sender: receiverId, receiver: senderId }
          ]
      }).sort({ createdAt: 1 }); // Sort messages from oldest to newest

      res.status(200).json({ messages });
  } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages", error });
  }
};


export default router;


