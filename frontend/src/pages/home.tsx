import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "/Users/juntrax/Desktop/Chatapp/frontend/src/config/axiosConfig.ts";
import "/Users/juntrax/Desktop/Chatapp/frontend/src/home.css";
import User from "/Users/juntrax/Desktop/Chatapp/backend/src/models/User.ts";
import io from "socket.io-client";
import ChatBox from "../components/ChatBox";
import { IUser } from "/Users/juntrax/Desktop/Chatapp/backend/src/models/User.ts";

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  media?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  _id?: string;
};

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<IUser | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isProfileVisible, setIsProfileVisible] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const navigate = useNavigate();

  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });

  socket.emit("send_messsage", messages);

  const Chat = ({ loggedInUser }: { loggedInUser: User }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>("");

    useEffect(() => {
      socket.on("send_message", (msg: Message) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on("receiveMessage", (msg: Message) => {
        console.log("Received message:", msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }, []);
  };

  const sendFriendRequest = async (receiverId: string) => {
    try {
      const token = localStorage.getItem("jwtToken");

      const response = await fetch("http://localhost:3000/requests/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: users?.name,
          receiver: receiverId,
          status: "pending",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSentRequests([...sentRequests, receiverId]);
        alert("Friend request sent!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user") || "";
    setUsers(JSON.parse(user));
  }, []);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const token = localStorage.getItem("jwtToken"); // Retrieve token from localStorage
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:3000/action/online");

        const data = response.data;

        setOnlineUsers(data.onlineUsers || []);

        console.log("Online Users:", data.onlineUsers);
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };

    fetchOnlineUsers();

    socket.on("updateOnlineUsers", (user: IUser[]) => {
      setOnlineUsers(user);
      console.log("Received Updated Online Users:", user);
    });

    return () => {
      socket.off("updateOnlineUsers");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("mobile");
    alert("Logout successful!");
    navigate("/Login");

    socket.disconnect();
  };

  const handleHome = () => {
    console.log("Home clicked");
    navigate("/home");
  };

  const handleSelectedUser = (user: IUser) => {
    setSelectedUser(user);
  };

  // Ensure messages are received once, outside the function
  useEffect(() => {
    socket.on("receive_message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("receive_message"); // Cleanup listener on unmount
    };
  }, []);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedMedia(e.target.files[0]);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(e.target.value);
    setIsTyping(e.target.value.trim() !== "");
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleMenu = () => {
    console.log("Menu clicked");
    setIsMenuVisible((prev) => !prev);
  };

  const handleProfile = () => {
    console.log("Profile clicked");
    navigate("/profile");
  };

  const handleRequest = () => {
    console.log("Request clicked");
    navigate("/request");
  };

  return (
    <div className="home-container">
      {/* Main Content */}
      <div className="main-content">
        <button onClick={handleLogout} className="logout-button" title="Logout">
          <b>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
          </b>
        </button>

        <h1 className="title">Welcome to V-ChatApp!</h1>

        <h2>
          Your ultimate platform for real-time conversations and media sharing.
        </h2>

        <p>
          V-ChatApp is designed to bring people closer with instant messaging,
          seamless media sharing, and an intuitive user experience.
        </p>
        <ul>
          <li>🌟 Real-time chat with friends and colleagues</li>
          <li>📷 Share images and media files effortlessly</li>
          <li>🔒 Secure and private messaging</li>
        </ul>

        {users?.name && (
          <p className="welcome-message">
            Hi {users.name} <span className="user-name"></span>! Ready to chat?
          </p>
        )}

        <button
          onClick={handleMenu}
          className="menu-button"
          title="click to menu bar..."
        >
          {isMenuVisible ? "Close Menu" : " Click to Open Menu"}
        </button>
        {/* Sidebar */}
        {isMenuVisible && (
          <div className="sidebar">
            <h2 className="sidebar-title">Menu</h2>
            <ul className="sidebar-list">
              <li className="sidebar-item" onClick={handleHome}>
                Home
              </li>
              <li className="sidebar-item" onClick={handleProfile}>
                Profile
              </li>
              <li className="sidebar-item" onClick={handleRequest}>
                Request
              </li>
              <li className="sidebar-item">Settings</li>
              <li className="sidebar-item" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          </div>
        )}

        <div className="online-users">
          {users?.name && (
            <b>
              <p>Welcome {users?.name}!</p>
            </b>
          )}
          <h3>Our Users:</h3>
          {Array.isArray(onlineUsers) && onlineUsers.length > 0 ? (
            <ul>
              {onlineUsers.map((user, index) => (
                <li key={user.id || index}>
                  {" "}
                  {/* Fallback key to prevent duplicate key warnings */}
                  {user.name ? user.name : "Unknown User"}
                  <button
                    className="request-chat-button"
                    title="click for start chatting"
                    onClick={() => {
                      handleSelectedUser(onlineUsers[index]);
                    }}
                  >
                    Chat
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users online</p>
          )}
        </div>

        {selectedUser && (
          <ChatBox
            selectedUser={selectedUser}
            loggedInUser={loggedInUser}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
