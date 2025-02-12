import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://192.168.1.165:3000/auth/login",
        { email, password },
        { withCredentials: true } // Ensure credentials are sent with request
      );

      if (response.data.token) {
        // Save the JWT token in localStorage
        localStorage.setItem("jwtToken", response.data.token);

        // Log success and redirect
        console.log("Login successful:", response.data);
        navigate("/home");
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
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      {/* <img
        alt="V-ChatApp"
        src="/mylogo.jpeg"
        style={{ width: "200px", display: "block", margin: "auto" }}
      /> */}

      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Login</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              display: "block",
              width: "120%",
              padding: "1rem",
              margin: "0.5rem 0",
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
            required
            style={{
              display: "block",
              width: "120%",
              padding: "1rem",
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
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
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
    </div>
  );
};

export default Login;
