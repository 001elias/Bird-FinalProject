import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProfileCard from "../components/profileCard";
import Card from "../components/card";
import Spinner from "../components/spinner";
import { searchTweets, searchUsers } from "../api/apis";

function Search() {
  let location = useLocation();

  const [users, setUsers] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [tab, setTab] = useState("tweets");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setLoading(true);
      searchTweets(location.state.searchTerm).then((data) => {
        setTweets(data);
      });
      searchUsers(location.state.searchTerm).then((data) => {
        setUsers(data);
      });

      setLoading(false);
    }
  }, [location.state?.searchTerm]);

  function renderTweets() {
    return (
      <div>
        {tweets.length > 0 ? (
          tweets.map((post, index) => (
            <Card
              key={`card${index}`}
              userName={post.Username}
              userId={post.UserID}
              profilePic={post.AvatarURL}
              text={post.Content}
              tweetImage={post.ImageURL}
            />
          ))
        ) : (
          <div class="alert alert-danger" role="alert">
            No results
          </div>
        )}
      </div>
    );
  }

  function renderUsers() {
    return (
      <div>
        {users.length > 0 ? (
          users.map((user, index) => (
            <ProfileCard
              key={`profile${index}`}
              userInfo={user}
              onFollow={handleFollow}
            />
          ))
        ) : (
          <div class="alert alert-danger" role="alert">
            No results
          </div>
        )}
      </div>
    );
  }

  function handleFollow(userId) {
    /* Update the following status of the user with userId == userId passed in input*/
    const updatedUsers = users.map((user, index) => {
      if (user.UserID == userId) {
        user.Following = !user.Following;
      }
      return user;
    });
    setUsers(updatedUsers);
  }

  if (!location.state) return null;

  return (
    <div class="container-fluid centered-content">
      <div class="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a
                className={`btn btn-link nav-link ${
                  tab == "tweets" ? "active" : ""
                }`}
                onClick={() => setTab("tweets")}
              >
                Tweets
              </a>
            </li>
            <li class="nav-item">
              <a
                className={`btn btn-link nav-link ${
                  tab == "users" ? "active" : ""
                }`}
                onClick={() => setTab("users")}
              >
                Users
              </a>
            </li>
          </ul>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <h1>Search results for: {location.state.searchTerm}</h1>
              {tab == "tweets" ? renderTweets() : renderUsers()}
            </>
          )}
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}

export default Search;
