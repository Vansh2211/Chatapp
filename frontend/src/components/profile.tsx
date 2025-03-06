import User from "/Users/juntrax/Desktop/Chatapp/backend/src/models/User";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "/Users/juntrax/Desktop/Chatapp/frontend/src/profile.css";
import manualAxios from "../config/axiosConfig";

type User = {
  name: string;
  email: string;
  mobile: number;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUpdatedUser(parsedUser);
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({ ...updatedUser!, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    if (!updatedUser) return;

    try {
      const response = await manualAxios.post(
        "/action/updateUser",
        updatedUser
      );
      if (response.status === 200) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      setError("Failed to update profile");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user") || "";
    setUser(JSON.parse(user));
  }, []);

  return (
    <div className="profileDesign">
      <button
        onClick={() => setIsMenuVisible((prev) => !prev)}
        className="profile-menu-button"
      >
        {isMenuVisible ? "Close Menu" : "Open Menu"}
      </button>

      {isMenuVisible && (
        <div className="sidebar">
          <h2 className="sidebar-title">Menu</h2>
          <ul className="sidebar-list">
            <li className="sidebar-item" onClick={() => navigate("/main")}>
              Home
            </li>
            <li className="sidebar-item" onClick={() => navigate("/home")}>
              Chat Page
            </li>
          </ul>
        </div>
      )}

      <h1>Profile 👤</h1>

      {user && (
        <div className="profileText">
          <p className="edit-name">
            <b>Name:</b>{" "}
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={updatedUser?.name || ""}
                onChange={handleChange}
              />
            ) : (
              user.name
            )}
          </p>
          <p className="edit-email">
            <b>Email:</b>{" "}
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={updatedUser?.email || ""}
                onChange={handleChange}
              />
            ) : (
              user.email
            )}
          </p>
          <p className="edit-mobile">
            <b>Mobile:</b>{" "}
            {isEditing ? (
              <input
                type="number"
                name="mobile"
                value={updatedUser?.mobile || ""}
                onChange={handleChange}
              />
            ) : (
              user.mobile
            )}
          </p>

          {isEditing ? (
            <>
              <button onClick={handleSaveChanges} className="save-button">
                Save
              </button>
              <button onClick={handleEditToggle} className="cancel-button">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEditToggle} className="edit-button">
              Edit Profile
            </button>
          )}
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Profile;
