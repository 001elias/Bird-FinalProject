import React, { useContext } from "react";
import DefaultUserAvatar from "../img/DefaultUser.jpg";
import { Link } from "react-router-dom";
import { followUser, unFollowUser } from "../api/apis";
import { AuthContext } from "../context/AuthContext";

function ProfileCard({ userInfo, onFollow }) {
  const { loggedUser } = useContext(AuthContext);

  async function handleFollow() {
    let result;
    if (userInfo.Following) {
      result = await unFollowUser(userInfo.UserID);
    } else {
      result = await followUser(userInfo.UserID);
    }
    if (result) {
      if (onFollow) onFollow(userInfo.UserID);
    }
  }

  return (
    <div className="card user-card">
      <img
        src={userInfo.AvatarURL || DefaultUserAvatar}
        alt="Profile Picture"
        className="card-profilepic"
      />
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/profile/${userInfo.Username}`}>{userInfo.Username}</Link>
          {userInfo.UserID != loggedUser.UserID ? (
            <button className="btn btn-info float-right" onClick={handleFollow}>
              {userInfo.Following ? "UnFollow" : "Follow"}
            </button>
          ) : null}
        </h5>
      </div>
    </div>
  );
}

export default ProfileCard;
