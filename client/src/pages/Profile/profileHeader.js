import React from "react";
import { Link } from "react-router-dom";

import DefaultUserAvatar from "../../img/DefaultUser.jpg";

function ProfileHeader({ loggedUser, profileInfo, onEditProfile, onFollow }) {
  return (
    <>
      <section className="headsec">
        <div>
          <h3>@{profileInfo.Username}</h3>
          <span>{profileInfo.TweetCount} Tweets</span>
        </div>
      </section>
      <section className="twitterprofile">
        <div className="headerprofileimage">
          <div className="default-banner"></div>
          <img
            src={profileInfo.AvatarURL || DefaultUserAvatar}
            alt="profile pic"
            id="profilepic"
          />

          {loggedUser.UserID != profileInfo.UserID && (
            <button
              className="btn btn-info float-right mt-2"
              onClick={onFollow}
            >
              {profileInfo.Following == 0 ? "Follow" : "UnFollow"}
            </button>
          )}

          {loggedUser.UserID == profileInfo.UserID && (
            <Link
              to={`/edit-profile/${profileInfo.Username}`}
              className="btn btn-light float-right mt-2 text-dark"
            >
              Edit Profile
            </Link>
          )}
        </div>
        <div className="bio">
          <div className="handle">
            <h3>{profileInfo.Fullname}</h3>
            <h5>@{profileInfo.Username}</h5>
          </div>
          <p>{profileInfo.Bio}</p>
          {profileInfo.Location && (
            <span>
              <i className="fa fa-location-arrow"></i>
              {profileInfo.Location}
            </span>
          )}
          {profileInfo.SocialURL && (
            <span className="ml-2">
              <a href={profileInfo.SocialURL}>
                <i className="fa fa-external-link" aria-hidden="true"></i>
                {profileInfo.SocialURL}
              </a>
            </span>
          )}
          <br />
          <div className="nawa">
            <div className="followers">
              {profileInfo.FollowsCount} <span>Following</span>
            </div>
            <div>
              {profileInfo.FollowerCount}
              <span> Followers</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfileHeader;
