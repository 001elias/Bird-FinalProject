import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Logo from "../img/Harelogofinal202339.png";
import DefaultUserAvatar from "../img/DefaultUser.jpg";

function TopBar({ userInfo }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  function renderLogo() {
    return (
      <div className="col-md-2 fixed-top text-left logo-container">
        <img
          src={Logo}
          alt="Left Image"
          className="img-fluid"
          style={{ maxHeight: "100px" }}
        />
      </div>
    );
  }

  function renderSearch() {
    return (
      <div className="col-md-8 offset-md-2 text-center">
        <div class="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search users or Posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            onClick={handleSearch}
            disabled={searchTerm == ""}
          >
            Search
          </button>
        </div>
      </div>
    );
  }

  function renderUserInfo() {
    return (
      <div
        className="col-md-2 fixed-top ml-auto text-right"
        style={{ paddingRight: "30px" }}
      >
        <div className="d-flex align-items-center">
          <p className="text-white mb-0 flex-grow-1">{userInfo.Username}</p>
          <Link to={`/profile/${userInfo.Username}`} className="btn btn-link">
            <img
              src={userInfo.AvatarURL || DefaultUserAvatar}
              alt="User Picture"
              className="profile-picture-small"
            />
          </Link>
        </div>
      </div>
    );
  }

  function handleProfileClick() {
    // Redirect to user profile
    navigate("./profile", { state: { userName: userInfo.Username } });
  }

  function handleSearch(e) {
    e.preventDefault();
    // Redirect to search page
    navigate("./search", { state: { searchTerm: searchTerm } });
  }

  // Function to handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate("./search", { state: { searchTerm: searchTerm } });
    }
  };

  return (
    <div className="row header" style={{ zIndex: 1000 }}>
      {/* Left-aligned column */}
      {renderLogo()}

      {/* Centered column */}
      {renderSearch()}

      {/* Right-aligned column */}
      {renderUserInfo()}
    </div>
  );
}

export default TopBar;
