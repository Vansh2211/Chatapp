// import User from "/Users/juntrax/Desktop/Chatapp/backend/src/models/User";
import axios from "axios";
import { profile } from "console";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../profile.css";

type User = {
  name: string;
  email: string;
  mobile: number;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);

  const navigate = useNavigate();

  const handlePMenu = () => {
    console.log("Menu clicked");
    setIsMenuVisible((prev) => !prev);
  };

  const handleProfile = () => {
    console.log("Profile clicked");
    navigate("/profile");
  };

  useEffect(() => {
    const user = localStorage.getItem("user") || "";
    setUser(JSON.parse(user));
  }, []);

  const handlePHome = () => {
    console.log("Home clicked");
    navigate("/home");
  };

  const handlePLogout = () => {
    localStorage.removeItem("jwtToken");
    alert("Logout successful!");
    navigate("/Login");
  };
  const handleRequest = () => {
    console.log("Request clicked");
    navigate("/request");
  };

  return (
    <div className="profileDesign">
      <button onClick={handlePMenu} className=" profile-menu-button">
        {isMenuVisible ? "Close Menu" : " Click to Open Menu"}
      </button>

      {isMenuVisible && (
        <div className="sidebar">
          <h2 className="sidebar-title">Menu</h2>
          <ul className="sidebar-list">
            <li className="sidebar-item" onClick={handlePHome}>
              Home
            </li>
            <li className="sidebar-item" onClick={handleProfile}>
              Profile
            </li>

            <li className="sidebar-item">Settings</li>
            <li className="sidebar-item" onClick={handlePLogout}>
              Logout
            </li>
          </ul>
        </div>
      )}

      <h1>Profile 👤</h1>
      {user && (
        <div className="profileText">
          <p>
            {" "}
            <b>Name: {user.name}</b>
          </p>
          <p>
            <b>Email: {user.email}</b>
          </p>
          <p>
            <b>Mobile: {user.mobile}</b>
          </p>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Profile;
