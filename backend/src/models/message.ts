import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  message: string;
  base64String: String; // Store Base64
  mediaType: String;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    base64String: {
      type: String,
    },
    mediaType: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema
);

export default Message;
