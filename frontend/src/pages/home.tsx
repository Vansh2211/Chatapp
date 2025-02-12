import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";
import "/Users/juntrax/Desktop/Chatapp/frontend/src/home.css";
import User from "/Users/juntrax/Desktop/Chatapp/backend/src/models/User.ts";
import OnlineUsers from "/Users/juntrax/Desktop/Chatapp/frontend/src/components/onlineUsers";


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
};

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);         

  const navigate = useNavigate();

  

  useEffect(() => {
    axios.get("/api/auth/me").then((response) => {
      setLoggedInUser(response.data);
    });

    axios
      .get("/api/users/online")
      .then((response) => {
        setOnlineUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching online users:", error);
        setOnlineUsers([]);
      });

  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem("jwtToken");
    axios
      .post("/api/auth/logout")
      .then(() => {
        console.log("Logout successful.");
        navigate("/Login"); 
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const handleToggleChat = () => {
    setIsChatVisible((prev) => !prev); 
  };

  const handleSendMessage = () => {
    if ((currentMessage.trim() || selectedMedia) && loggedInUser) {
      const message: Message = {
        sender: loggedInUser.name,
        content: currentMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        media: selectedMedia ? URL.createObjectURL(selectedMedia) : undefined,
        id: 0,
      };

      setMessages((prevMessages) => [...prevMessages, message]);
      setCurrentMessage("");
      setSelectedMedia(null);
      setIsTyping(false);
    }
  };

//   const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCurrentMessage(e.target.value);
//     setIsTyping(e.target.value.trim() !== "");
//   };

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

  const startAudioChat = async () => {

    const signalingServer = new WebSocket("ws://192.168.1.165:3000");
  try {
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const peerConnection = new RTCPeerConnection();

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.play();
    };

    // Signal offer/answer and ICE candidates using your signaling server
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        signalingServer.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    signalingServer.send(JSON.stringify({ offer }));

    signalingServer.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      if (data.answer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };
  } catch (error) {
    console.error("Error starting audio chat:", error);
  }
};


  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Menu</h2>
        <ul className="sidebar-list">
          <li className="sidebar-item">Home</li>
          <li className="sidebar-item">Profile</li>
          <li className="sidebar-item">Settings</li>
          <li className="sidebar-item" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>           
  
      {/* Main Content */}
      <div className="main-content">
        <h1 className="title">Welcome to V-ChatApp!</h1>
        <h2>Your ultimate platform for real-time conversations and media sharing.</h2>
        <p>
          V-ChatApp is designed to bring people closer with instant messaging, seamless media sharing, and an intuitive user experience. 
        </p>
        <ul>
          <li>🌟 Real-time chat with friends and colleagues</li>
          <li>📷 Share images and media files effortlessly</li>
          <li>🔒 Secure and private messaging</li>
        </ul>
        <p>Click the <strong>Show Chat</strong> button below to start a conversation and connect with your friends.</p>

        {loggedInUser && (
          <p className="welcome-message">
            Hi <span className="user-name">{loggedInUser.name}</span>! Ready to chat?
          </p>
        )}

        
        <button onClick={handleToggleChat} className="chat-toggle-button">
          {isChatVisible ? "Hide Chat" : "Show Chat"}
        </button>

        
        {isChatVisible && (
          <div className="chat-box">
            <h2 className="section-title">Chat</h2>

            <div className="messages-box">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className="message">
                    <div className="message-header">
                      <strong>{msg.sender}:</strong> {msg.content}
                      
                      <span className="timestamp">{msg.timestamp}</span>
                    </div>
                    {msg.media && (
                      <div className="media-preview">
                        <img src={msg.media} alt="Shared" className="shared-media" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>

            {isTyping && <p className="typing-indicator">You are typing...</p>}

            <div className="input-buttons">
              <input
                type="text"
                value={currentMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="message-input"
              />
              <label htmlFor="media-upload" className="media-input-label">
                Media
              </label>
              <input
                type="file"
                id="media-upload"
                accept="image/*"
                onChange={handleMediaChange}
                className="media-input"
              />
              <button onClick={handleSendMessage} className="send-button">
                Send
              </button>
              <button onClick={clearChat} className="clear-button">
                Clear Chat
              </button>

              <button onClick={startAudioChat} className="audio-chat-button">
    🎤 Audio
  </button>
            </div>

            {/* Media Preview */}
            {selectedMedia && (
              <div className="media-preview">
                <p>Selected Media:</p>
                <img
                  src={URL.createObjectURL(selectedMedia)}
                  alt="Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
