import React, { useState, useEffect, useContext } from "react"; // Make sure the path to your CSS file is correct

import Card from "../../components/card";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../../components/spinner";

function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const [tweets, setTweets] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isLoggedIn) navigate("/login");

  useEffect(() => {
    async function fetchTweets() {
      try {
        setLoading(true);
        const response = await fetch("/get-tweets"); // Adjust the endpoint as necessary
        if (response.ok) {
          const data = await response.json();
          setTweets(data);
        } else {
          // Handle HTTP errors
          console.error("Failed to fetch tweets:", response.statusText);
        }
      } catch (error) {
        // Handle network errors
        console.error("Network error when fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTweets();
  }, []);

  return (
    <div className="container-fluid mt-3" style={{ paddingLeft: "120px" }}>
      <div className="row mt-3">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          {/* Loop through tweets and create a Card for each */}
          {tweets &&
            tweets.map((tweet, index) => (
              <Card
                key={index}
                userName={tweet.Username}
                userId={tweet.UserID}
                profilePic={tweet.AvatarURL}
                text={tweet.Content}
                tweetImage={tweet.ImageURL}
              />
            ))}
          {loading && tweets == null ? (
            <Spinner />
          ) : (
            tweets &&
            tweets.length == 0 && (
              <div className="mx-auto" style={{ width: "500px" }}>
                <h1>Nothing to display here</h1>
                <p>
                  Time to post your first Tweet !
                  <Link to="/tweet" className="ml-2 btn btn-info">
                    Post
                  </Link>
                </p>
              </div>
            )
          )}
        </div>

        {/* <Hashtags /> */}
      </div>
    </div>
  );
}

export default Home;
