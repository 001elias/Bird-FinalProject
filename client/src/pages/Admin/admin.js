import React, { useState, useEffect } from "react";
import "./admin.css";
import {
  getAllUsers,
  blockUser,
  deleteUser,
  searchTweets,
  deleteTweet,
} from "../../api/apis";

import Card from "../../components/card";
import Spinner from "../../components/spinner";

function Admin() {
  const [activeSection, setActiveSection] = useState("users");
  const [users, setUsers] = useState([]);
  const [tweets, setTweets] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllUsers().then((data) => {
      if (data) {
        setUsers(data);
      }
    });
  }, []);

  function handleClickTweets() {
    setActiveSection("tweets");
  }

  async function handleBlock(userInfo) {
    const result = await blockUser(userInfo.UserID, !userInfo.isBlocked);
    if (!result) return console.error("Failed to block user");

    const updatedUsers = users.map((user) => {
      if (user.Username === userInfo.Username) {
        user.isBlocked = !userInfo.isBlocked;
      }
      return user;
    });
    setUsers(updatedUsers);
  }

  async function handleDeleteUser(userID) {
    const result = await deleteUser(userID);
    if (!result) {
      console.error("Failed to delete user", userID);
      return;
    }

    const updatedUsers = users.filter((user) => user.UserID !== userID);
    setUsers(updatedUsers);
  }

  async function handleDeleteTweet(tweetID) {
    const result = await deleteTweet(tweetID);
    if (!result) {
      console.error("Failed to delete tweet", tweetID);
      return;
    }

    const updatedTweets = tweets.filter((tweet) => tweet.TweetID !== tweetID);
    setTweets(updatedTweets);
  }

  function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    searchTweets(searchTerm).then((data) => {
      setTweets(data);
      setLoading(false);
    });
  }

  function renderTweets() {
    if (!tweets) return null;

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
              adminMode={true}
              onDelete={() => handleDeleteTweet(post.TweetID)}
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
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <h1>Admin Page</h1>

          <section className="mt-5">
            <div className="heading">
              <p
                className={activeSection == "users" ? "active" : ""}
                onClick={() => setActiveSection("users")}
              >
                Users
              </p>
              <p
                onClick={() => handleClickTweets()}
                className={activeSection == "tweets" ? "active" : ""}
              >
                Tweets
              </p>
            </div>
          </section>

          {activeSection === "users" && (
            <section className="section-content">
              <table class="table table-dark">
                <thead>
                  <tr>
                    <th scope="col">Username</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr>
                      <td>{user.Username}</td>
                      <td>{user.Fullname}</td>
                      <td>
                        <button
                          className="btn btn-info"
                          onClick={() => handleBlock(user)}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>

                        <button
                          className="ml-3 btn btn-danger"
                          onClick={() => handleDeleteUser(user.UserID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeSection === "tweets" && (
            <section className="section-content">
              <div className="col-md-6">
                <form onSubmit={handleSearch}>
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Tweets"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      className="btn btn-secondary"
                      type="submit"
                      disabled={searchTerm == ""}
                    >
                      Search
                    </button>
                  </div>
                </form>
                <p>{loading ? <Spinner /> : renderTweets()}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
