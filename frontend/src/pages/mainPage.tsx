import React from "react";
import { useNavigate } from "react-router-dom";

const Main: React.FC = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/home");
  };

  return (
    <div className="home-container">
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

      <button className="start-chat-button" onClick={handleHome}>
        Start Chatting
      </button>
    </div>
  );
};

export default Main;
