import React from "react";

function Card({ username, profilePic, text, tweetImage }) {
  return (
    <div className="card">
      <img src={profilePic} alt="Profile Picture" className="card-profilepic" />
      <div className="card-body">
        <h5 className="card-title">{username}</h5>
        <p className="card-text">{text}</p>
        {tweetImage && (
          <img src={tweetImage} alt="Content Image" className="img-fluid" />
        )}
      </div>
    </div>
  );
}

export default Card;
