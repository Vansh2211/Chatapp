import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";
// import bcrypt from 'bcrypt';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import Message from "../models/message";
import { useReducer } from "react";

// Register User
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return; // Ensure the function stops here
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, mobile, password: hashedPassword });
    await newUser.save();

    const updatedUser = {
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
    };

    res
      .status(201)
      .json({ message: "User created successfully", user: updatedUser });
  } catch (error) {
    console.error("Error creating user:", error); // Log the actual error
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.online = true;
    user.save();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "9h",
    });

    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      online: user.online,
    };

    res
      .status(200)
      .json({ message: "Login successful", data: { token, updatedUser } });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

const tokenBlacklist = new Set<string>();

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("jwtToken");

    const email = req.body.email;

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      tokenBlacklist.add(token);
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.online = false;
    user.save();
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
