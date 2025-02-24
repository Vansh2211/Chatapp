import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import actionRoutes from "./routes/actionRoutes";
import requestRoutes from "./controller/userRequestController";
import Message from "./models/message";
import { Conversation } from "./models/conversation";
import ensureAuthenticated from "./routes/authEnsure";

require("dotenv").config();

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.165:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/requests", ensureAuthenticated, requestRoutes);
app.use("/action", actionRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error stack:", err.stack);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
);

const PORT = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },

  transports: ["websocket"],
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("send_message", async (message) => {
    try {
      console.log("Message received:", message);

      if (!message.senderId || !message.receiverId || !message.message) {
        console.log("Kuch ids missing hai bhai", {
          senderId: message.senderId,
          receiverId: message.receiverId,
          message: message.message,
        });
      }

      let conversation = await Conversation.findOne({
        participants: { $all: [message.senderId, message.receiverId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [message.senderId, message.receiverId],
        });
        await conversation.save();
      }

      console.log("Conversation found or created:", conversation);

      if (!conversation._id) {
        console.error("Error: Conversation ID is missing!");
        return;
      }

      const newMessage = new Message({
        conversationId: conversation._id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        message: message.message,
      });

      await newMessage.save();

      io.emit("receive_message", newMessage);
    } catch (error) {
      console.error(error);
    }

    // io.emit("receive_message", message);
  });

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("userOnline", (user) => {
    onlineUsers.set(user, socket.id);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
