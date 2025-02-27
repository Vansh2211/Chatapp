import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { IUser } from "/Users/juntrax/Desktop/Chatapp/backend/src/models/User.ts";

import { Socket } from "socket.io-client";

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
          </svg>
        </button>
        <button onClick={clearChat} className="clear-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e8eaed"
          >
            <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
