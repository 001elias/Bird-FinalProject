import React, { useState } from "react";
import Logo from "../img/Harelogofinal202339.png";

function TopBar() {
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
        <div className="input-group rounded-search-container">
          <input
            type="text"
            className="form-control rounded-search search-input"
            placeholder="Search"
          />
        </div>
      </div>
    );
  }

  function renderUserInfo() {
    return (
      <div
        className="col-md-2 fixed-top ml-auto text-right"
        style={{ paddingRight: "30px", paddingTop: "20px" }}
      >
        <div className="d-flex align-items-center">
          <p className="text-white mb-0 flex-grow-1">Jen.Eric</p>
          <img
            src="OIG2.jpg"
            alt="User Picture"
            className="img-fluid rounded-circle mr-auto pl-2"
            style={{ height: "70px" }}
          />
        </div>
      </div>
    );
  }

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
