import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";
import Logo from "../../img/Harelogofinal202339.png";

function clearAllCookies() {
  document.cookie.split(";").forEach(function (c) {
    document.cookie =
      c.trim().split("=")[0] +
      "=;expires=" +
      new Date(0).toUTCString() +
      ";path=/";
  });
}

function Register() {
  useEffect(() => {
    clearAllCookies();
  }, []);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  /* const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = { username, email, password };

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User registered successfully");
        navigate("/login");
      } else {
        const data = await response.json(); // Only parse JSON if response is not ok
        console.log("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("There was an error during registration:", error);
    }
  };

  return (
    <div className="login-container">
      <img src={Logo} alt="Hare Logo" className="logo" />
      <h2>Sign Up to Hare</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="next-btn">
          Sign Up
        </button>
      </form>
      <div className="login-footer">
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
