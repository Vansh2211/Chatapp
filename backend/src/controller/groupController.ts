import { Request, Response } from "express";
import Group from "../models/group"; // Import the Group model
import User from "../models/User"; // Import the User model

export const createGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, members } = req.body;
    const adminId = req.body; // Assuming user is authenticated
    if (!adminId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    if (!name || !members || members.length < 2) {
      res
        .status(400)
        .json({ message: "Group name and at least 2 members are required" });
      return;
    }

    if (!members.includes(adminId.toString())) {
      members.push(adminId);
    }

    // Create group
    const newGroup = new Group({
      name,
      members,
      admin: adminId,
    });

    await newGroup.save();

    res
      .status(201)
      .json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};
