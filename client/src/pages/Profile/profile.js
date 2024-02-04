import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams, Link } from "react-router-dom";

import "./profile.css";
import Logo from "../../img/Harelogofinal202339.png";
import Card from "../../components/card";
import ProfileCard from "../../components/profileCard";
import ProfileHeader from "./profileHeader";
import { AuthContext } from "../../context/AuthContext";
import Spinner from "../../components/spinner";

import {
  getUserProfile,
  getUserTweets,
  getFollowers,
  getFollowing,
  followUser,
  unFollowUser,
} from "../../api/apis";

function Profile() {
  const { username } = useParams();
  const { loggedUser } = useContext(AuthContext);
  const [tweets, setTweets] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeSection, setActiveSection] = useState("tweets");
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    setTweets([]);
    setFollowers([]);
    setFollowing([]);
    setActiveSection("tweets");

    getUserProfile(username).then((data) => {
      if (data) {
        setProfileInfo(data[0]);
        setLoading(true);
        getUserTweets(data[0].UserID).then((tweets) => {
          setTweets(tweets);
          setLoading(false);
        });
      }
    });
  }, [username]);

  if (!profileInfo) return null;

  async function handleClickFollowers() {
    setActiveSection("followers");
    if (followers.length == 0) {
      setLoading(true);
      const data = await getFollowers(profileInfo.UserID);
      setLoading(false);
      setFollowers(data);
    }
  }

  async function handleClickFollowig() {
    setActiveSection("following");
    if (following.length == 0) {
      setLoading(true);
      const data = await getFollowing(profileInfo.UserID);
      setLoading(false);
      setFollowing(data);
    }
  }

  function handleToggleFollower(userId) {
    /* Update the following status of the user the logged user wants to follow in the followers array*/
    const updatedUsers = followers.map((user) => {
      if (user.UserID == userId) {
        user.Following = !user.Following;
      }
      return user;
    });
    setFollowers(updatedUsers);
  }

  function handleToggleFollowing(userId) {
    /* Update the following status of the user the logged user wants to follow in the following array*/
    const updatedUsers = following.map((user) => {
      if (user.UserID == userId) {
        user.Following = !user.Following;
      }
      return user;
    });
    setFollowing(updatedUsers);
  }

  async function handleFollowProfile() {
    let result;
    if (profileInfo.Following) {
      result = await unFollowUser(profileInfo.UserID);
    } else {
      result = await followUser(profileInfo.UserID);
    }
    if (result)
      setProfileInfo({ ...profileInfo, Following: !profileInfo.Following });
  }

  return (
    <div className="profile-page">
      <div className="container-fluid mt-3">
        {/* Header */}
        <div className="row header" style={{ zIndex: 1000 }}>
          {/* Left-aligned column) */}
          <div className="col-md-2 fixed-top text-left logo-container">
            <img
              src={Logo}
              alt="Left Image"
              className="img-fluid"
              style={{ maxHeight: "100px" }}
            />
          </div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div id="totop"></div>
              <a href="#totop" className="fa fa-arrow-up" id="fixedarrow"></a>

              <div className="flexcontainer">
                <div className="middlecontainer">
                  <ProfileHeader
                    loggedUser={loggedUser}
                    profileInfo={profileInfo}
                    onFollow={handleFollowProfile}
                  />

                  <section className="tweets">
                    <div className="heading">
                      <p
                        className={activeSection == "tweets" ? "active" : ""}
                        onClick={() => setActiveSection("tweets")}
                      >
                        Tweets
                      </p>
                      <p
                        onClick={() => handleClickFollowers()}
                        className={activeSection == "followers" ? "active" : ""}
                      >
                        Followers
                      </p>
                      <p
                        onClick={() => handleClickFollowig()}
                        className={activeSection == "following" ? "active" : ""}
                      >
                        Following
                      </p>
                    </div>
                  </section>

                  {activeSection === "tweets" && (
                    <section className="mytweets">
                      {/* Cards */}
                      <div>
                        {/* Loop through tweets and create a Card for each */}
                        {tweets?.length > 0 ? (
                          tweets.map((tweet, index) => (
                            <Card
                              key={index}
                              userName={tweet.Username}
                              userId={tweet.UserID}
                              profilePic={tweet.AvatarURL}
                              text={tweet.Content}
                              tweetImage={tweet.ImageURL}
                            />
                          ))
                        ) : (
                          <>{loading ? <Spinner /> : <h3>No tweets</h3>}</>
                        )}
                      </div>
                    </section>
                  )}
                  {activeSection === "followers" && (
                    <section className="mytweets">
                      <div>
                        {/* Loop through followers and create a Profile Card for each */}
                        {followers?.length > 0 ? (
                          followers.map((user, index) => (
                            <ProfileCard
                              key={"follower" + index}
                              userInfo={user}
                              onFollow={handleToggleFollower}
                            />
                          ))
                        ) : (
                          <>{loading ? <Spinner /> : <h3>No Followers</h3>}</>
                        )}
                      </div>
                    </section>
                  )}
                  {activeSection === "following" && (
                    <section className="mytweets">
                      <div>
                        {/* Loop through following user list and create a Profile Card for each */}
                        {following?.length > 0 ? (
                          following.map((user, index) => (
                            <ProfileCard
                              key={"following" + index}
                              userInfo={user}
                              onFollow={handleToggleFollowing}
                            />
                          ))
                        ) : (
                          <>
                            {loading ? (
                              <Spinner />
                            ) : (
                              <h3>Not Following anyone</h3>
                            )}
                          </>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
