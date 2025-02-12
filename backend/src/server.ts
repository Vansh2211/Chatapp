import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import { Request } from "express";
import requestRoutes from "/Users/juntrax/Desktop/Chatapp/backend/src/routes/UserRequest";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import Message from "./models/message";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173","http://192.168.1.165:5173"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/requests",requestRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error stack:", err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});



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
    console.log("Message received:", message);
    

    
    io.emit("receive_message", message);
    
  });

  socket.on("join_room",(room) =>{
    socket.join(room);
  })

  
  socket.on('userOnline', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('updateOnlineUsers', Array.from(onlineUsers.keys()));
});



      
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
