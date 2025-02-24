import React from "react";
import "/Users/juntrax/Desktop/Chatapp/frontend/src/sidebar.css"; 
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const navigate = useNavigate();

const handleLogout = () => {
    axios
      .post("/api/auth/logout")
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });


// type SidebarProps = {
//   onLogout: () => void // Function to handle logout
// };

// const Sidebar: React.FC<SidebarProps> = ({onLogout}) => {
  return (
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
  );
};

export default handleLogout;
