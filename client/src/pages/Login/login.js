import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";
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

function Login() {
  useEffect(() => {
    clearAllCookies();
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { setIsLoggedIn, setLoggedUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", // Needed for cookies/session
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user.isBlocked) {
        setErrorMessage(
          "Your account has been suspended. Please contact support."
        );
        return;
      }
      setLoggedUser(data.user);
      setIsLoggedIn(true); // Update the context's state
      localStorage.setItem("isLoggedIn", "true"); // Optionally update localStorage
      localStorage.setItem("loggedUser", JSON.stringify(data.user)); // Optionally update localStorage

      navigate("/home"); // Redirect to the home page
    } else {
      // Handle login failure
      console.log("Login failed");
      setErrorMessage("Login failed");
    }
  };

  return (
    <div className="login-container">
      <img src={Logo} alt="Hare Logo" className="logo" />
      <h1>Sign in to Hare</h1>
      <div className="divider">Use your Username and Password</div>
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="login-form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-form-input"
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
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
