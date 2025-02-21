import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import User, {
  IUser,
} from "/Users/juntrax/Desktop/Chatapp/backend/src/models/User.ts";

import { Socket } from "socket.io-client";
import axios from "axios";
import { response } from "express";

type ChatBoxProps = {
  selectedUser: IUser;
  loggedInUser: IUser | null;
  socket: typeof Socket;
};

type Message = {
  id: number;
  senderId: string;
  receiverId: any;
  message: string;
  timestamp: string;
};

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const ChatBox: React.FC<ChatBoxProps> = ({ selectedUser, loggedInUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<Message[]>([]);
  //  const [users, setUsers] = useState<IUser | null>(null);

  useEffect(() => {
    socket.on("receive_message", (msg: Message) => {
      if (
        (msg.senderId === loggedInUser?._id &&
          msg.receiverId === selectedUser._id) ||
        (msg.senderId === selectedUser._id &&
          msg.receiverId === loggedInUser?._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [selectedUser._id, loggedInUser?._id]);

  const handleSendMessage = async () => {
    const response = await fetch("http://localhost:3000/action/messages", {
      method: "GET",
      credentials: "include",
    });

    const data = response.json();

    console.log("Message", data);

    if (currentMessage.trim() && selectedUser.name) {
      const message: Message = {
        senderId: (loggedInUser?._id as string) || "Unknown",
        receiverId: selectedUser._id,
        message: currentMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),

        id: Date.now(),
      };

      socket.emit("send_message", message);

      // Clear input fields
      setCurrentMessage("");

      setIsTyping(false);
    }
  };

  const clearChat = () => {
    console.log("clear");
    setMessages([]);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
    setIsTyping(e.target.value.trim() !== "");
  };

  useEffect(() => {
    console.log("useeffect", messages);
  }, [messages]);

  return (
    <div className="chat-box">
      <h2 className="section-title">Chat with {selectedUser.name} </h2>
      <div className="messages-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === loggedInUser?._id
                ? "my-message"
                : "other-message"
            }`}
          >
            <strong>
              {msg.senderId === loggedInUser?._id
                ? loggedInUser.name
                : selectedUser.name}
              :
            </strong>{" "}
            {msg.message} <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      {/* {isTyping && <p className="typing-indicator">You are typing...</p>} */}

      <div className="input-buttons">
        <input
          type="text"
          value={currentMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="message-input"
        />

        <button
          onClick={() => {
            handleSendMessage();
          }}
          className="send-button"
        >
          Send
        </button>
        <button onClick={clearChat} className="clear-button">
          Clear
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
