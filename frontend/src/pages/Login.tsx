import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "/Users/juntrax/Desktop/Chatapp/frontend/src/config/axiosConfig.ts";
import io from "socket.io-client";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const connectSocket = () => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    connectSocket();
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true } // Ensure credentials are sent with request
      );
      console.log("response", response.data);

      if (response.data.data.token) {
        const data = response.data.data;
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.updatedUser));

        // localStorage.setItem("mobile", data.user.mobile);

        console.log("Login successful:", data);
        navigate("/main");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container1 px-5 py-24 mx-auto flex flex-wrap items-center"
      style={{
        maxWidth: "550px",
        margin: "auto",
        paddingLeft: "1.5rem",
        paddingRight: "1rem",
        flexWrap: "wrap",
      }}
    >
      <img
        alt="V-ChatApp"
        src="/mylogo.jpeg"
        style={{ width: "150px", display: "block", margin: "auto" }}
      />

      <h2 style={{ textAlign: "center", marginBottom: "0.3rem" }}>Login</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email"></label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              display: "block",
              width: "90%",
              padding: "0.8rem",
              margin: "0.5rem 0",
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
            required
            style={{
              display: "block",
              width: "90%",
              padding: "0.8rem",
              margin: "0.5rem 0",
            }}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          style={{
            backgroundColor: "#20b857",
            color: "white",
            padding: "0.8rem 1rem",
            border: "none",
            borderStyle: "rounded",
            borderRadius: "40px",
            cursor: "pointer",
            width: "40%",
          }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Link to Signup */}
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Not a user?{" "}
          <Link
            to="/SignUp"
            style={{
              color: "#20b857",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Register here
          </Link>
        </p>
      </form>

      {/* Google Login Button */}
      {/* <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <GoogleLoginButton />
      </div> */}
    </div>
  );
};

export default Login;
