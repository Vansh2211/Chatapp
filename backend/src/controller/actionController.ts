import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";
// import bcrypt from 'bcrypt';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import Message from "/Users/juntrax/Desktop/Chatapp/backend/src/models/message";
import { Conversation } from "/Users/juntrax/Desktop/Chatapp/backend/src/models/conversation";

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

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, mobile, password } = req.user as IUser;
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    console.log(name);
    console.log(email);
    res.status(200).json({ message: "User found", name });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

//getOnline users

const onlineUsersSet = new Set<string>(); // Store online users' IDs

export const onlineUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  try {
    // Fetch user details for all online users
    const users = await User.find({ online: true }).select("name email mobile");

    res
      .status(200)
      .json({ message: "Online users retrieved", onlineUsers: users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch online users", error });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      res.status(400).json({ message: "Sender and receiver IDs are required" });
      return;
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      res.status(200).json({ messages: [] });
      return;
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages", error });
  }
};
