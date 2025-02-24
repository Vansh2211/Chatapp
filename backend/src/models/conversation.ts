import mongoose, { Document, Schema, Model } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
