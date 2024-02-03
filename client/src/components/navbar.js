import React from "react";
import { useNavigate, Link } from "react-router-dom";
import homeicon from "../img/Home.(transparent).png";
import searchicon from "../img/Search(transparent).png";
import notificationsicon from "../img/Notifications(checked)(transparent).png";
import messagesicon from "../img/Messages(read)(transparent).png";
import posticon from "../img/Post(transparent).png";
import logouticon from "../img/Logout(transparent).png";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import posticon from "../img/Post(transparent).png";
import logouticon from "../img/Logout(transparent).png";

function Navbar() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Make a request to the server to end the session
      const response = await fetch("/logout", {
        method: "GET", // or POST if your server expects a POST request
        credentials: "include", // Required if your server uses cookies
      });

      if (response.ok) {
        // Clear client-side state
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");

        // Redirect to login page
        navigate("/login");
      } else {
        // Handle errors, e.g., display a message
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("There was an error during logout:", error);
    }
  };
  return (
    <div className="col-md-2">
      <div className="list-group">
        <Link to="/Home" className="list-group-item list-group-item-action">
          <img src={homeicon} alt="Home" className="sidebar-icon" />
          Home
        </Link>
        <Link to="/tweet" className="list-group-item list-group-item-action">
          <img src={posticon} alt="Post" className="sidebar-icon" />
          Tweet
        </Link>
        <Link to="#" className="list-group-item list-group-item-action">
          <img
            src={notificationsicon}
            alt="Notifications"
            className="sidebar-icon"
          />
          Notifications
        </Link>
        <Link to="#" className="list-group-item list-group-item-action">
          <img src={messagesicon} alt="Messages" className="sidebar-icon" />
          Messages
        </Link>

        <a
          href="#"
          className="list-group-item list-group-item-action"
          onClick={handleLogout}
        >
          <img src={logouticon} alt="Logout" className="sidebar-icon" />
          Logout
        </a>
      </div>
    </div>
  );
}
export default Navbar;
