import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import User, {
  IUser,
} from "/Users/juntrax/Desktop/Chatapp/backend/src/models/User.ts";

import { Socket } from "socket.io-client";

type ChatBoxProps = {
  selectedUser: IUser;
  loggedInUser: IUser | null;
  socket: typeof Socket;
};

type Message = {
  id: number;
  sender: string;
  receiver: any;
  content: string;
  timestamp: string;
};

const socket = io("http://localhost:3000", { transports: ["websocket"] });

const ChatBox: React.FC<ChatBoxProps> = ({ selectedUser, loggedInUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  //  const [users, setUsers] = useState<IUser | null>(null);

  useEffect(() => {
    console.log("inchtbox", loggedInUser);
  }, [loggedInUser]);

  useEffect(() => {
    socket.on("receive_message", (msg: Message) => {
      console.log("mesagesbdad", msg);
      if (
        msg.sender === selectedUser._id ||
        msg.receiver === loggedInUser?._id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSendMessage = async () => {
    console.log(currentMessage, selectedUser.name);

    if (currentMessage.trim() && selectedUser.name) {
      const message: Message = {
        sender: loggedInUser?.name || "Unknown",
        receiver: selectedUser._id,
        content: currentMessage,
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
              msg.sender === loggedInUser?.name ? "my-message" : "other-message"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.content}{" "}
            <span className="timestamp">{msg.timestamp}</span>
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
