import React from "react";
import DefaultUserAvatar from "../img/DefaultUser.jpg";
import { Link } from "react-router-dom";

function ProfileCard({ userInfo }) {
  function handleUserClick() {
    // Redirect to user profile
  }

  return (
    <div className="card user-card">
      <img
        src={userInfo.AvatarURL || DefaultUserAvatar}
        alt="Profile Picture"
        className="card-profilepic"
      />
      <div className="card-body">
        <Link to={`/profile/${userInfo.Username}`}>
          <h5 className="card-title">
            {userInfo.Username}
            <button className="btn btn-info float-right">Follow</button>
          </h5>
        </Link>
      </div>
    </div>
  );
}

export default ProfileCard;
