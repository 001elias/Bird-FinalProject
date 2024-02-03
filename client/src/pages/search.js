import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProfileCard from "../components/profileCard";
import Card from "../components/card";
import Spinner from "../components/spinner";

function Search() {
  let location = useLocation();

  const [users, setUsers] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [tab, setTab] = useState("tweets");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function searchTweets() {
      try {
        const response = await fetch("/search-tweets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchTerm: location.state.searchTerm }),
        }); // Adjust the endpoint as necessary
        if (response.ok) {
          const data = await response.json();
          setTweets(data);
        } else {
          // Handle HTTP errors
          console.error("Failed to fetch search results:", response.statusText);
        }
      } catch (error) {
        // Handle network errors
        console.error("Network error when fetching search results:", error);
      }
    }

    async function searchUsers() {
      try {
        const response = await fetch("/search-users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchTerm: location.state.searchTerm }),
        }); // Adjust the endpoint as necessary
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setLoading(false);
        } else {
          // Handle HTTP errors
          console.error("Failed to fetch search results:", response.statusText);
        }
      } catch (error) {
        // Handle network errors
        console.error("Network error when fetching search results:", error);
      }
    }
    setLoading(true);
    searchTweets();
    searchUsers();
  }, [location.state.searchTerm]);

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
            <ProfileCard key={`profile${index}`} userInfo={user} />
          ))
        ) : (
          <div class="alert alert-danger" role="alert">
            No results
          </div>
        )}
      </div>
    );
  }

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
