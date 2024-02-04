import React from "react";
import DefaultUserAvatar from "../img/DefaultUser.jpg";
import { Link } from "react-router-dom";

function Card({
  userName,
  userID,
  profilePic,
  text,
  tweetImage,
  adminMode = false,
  onDelete,
}) {
  return (
    <div className="card">
      <img
        src={profilePic || DefaultUserAvatar}
        alt="Profile Picture"
        className="card-profilepic"
      />

      <div className="card-body">
        {!adminMode ? (
          <Link to={`/profile/${userName}`}>
            <h5 className="card-title">{userName}</h5>
          </Link>
        ) : (
          <h5 className="card-title">
            {userName}
            {adminMode && (
              <button
                className="btn btn-danger float-right"
                onClick={() => onDelete(userID)}
              >
                Delete
              </button>
            )}
          </h5>
        )}
        <p className="card-text">{text}</p>
        {tweetImage && (
          <img src={tweetImage} alt="Content Image" className="img-fluid" />
        )}
      </div>
    </div>
  );
}

export default Card;
