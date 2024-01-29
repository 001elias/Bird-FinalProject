import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as necessary
import "./login.css";
import Logo from "../img/Harelogofinal202339.png";
function clearAllCookies() {
  document.cookie.split(";").forEach(function (c) {
    document.cookie =
      c.trim().split("=")[0] +
      "=;expires=" +
      new Date(0).toUTCString() +
      ";path=/";
  });
}

function Login() {
  useEffect(() => {
    clearAllCookies();
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  /*   const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }; */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", // Needed for cookies/session
    });

    if (response.ok) {
      setIsLoggedIn(true); // Update the login state
      navigate("/home"); // Redirect to home or another route
    } else {
      // Handle login failure
      console.log("Login failed");
    }
  };

  return (
    <div className="login-container">
      <img src={Logo} alt="Hare Logo" className="logo" />
      <h1>Sign in to Hare</h1>
      <div className="divider">Use your Username and Password</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="passwordfield"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="next-btn">
          Sign in
        </button>
      </form>
      <div className="login-footer">
        <a href="#">Forgot password?</a>
        <p>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
