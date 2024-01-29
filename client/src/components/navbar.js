import React from "react";
import homeicon from "../img/Home.(transparent).png";
import searchicon from "../img/Search(transparent).png";
import notificationsicon from "../img/Notifications(checked)(transparent).png";
import messagesicon from "../img/Messages(read)(transparent).png";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) {
    return null;
  }
  const handleLogout = () => {
    // Perform logout logic (e.g., clearing session, making a logout API call)
    setIsLoggedIn(false);
  };
  return (
    <div className="col-md-2">
      <div className="list-group">
        <a href="#" className="list-group-item list-group-item-action">
          <img src={homeicon} alt="Home" className="sidebar-icon" />
          Home
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img src={searchicon} alt="Search" className="sidebar-icon" />
          Search
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img
            src={notificationsicon}
            alt="Notifications"
            className="sidebar-icon"
          />
          Notifications
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img src={messagesicon} alt="Messages" className="sidebar-icon" />
          Messages
        </a>
        {isLoggedIn && (
          <a
            href="#"
            className="list-group-item list-group-item-action"
            onClick={handleLogout}
          >
            Logout
          </a>
        )}
      </div>
    </div>
  );
}
export default Navbar;
