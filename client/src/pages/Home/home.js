import React, { useState, useEffect, useContext } from "react"; // Make sure the path to your CSS file is correct

import Card from "../../components/card";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Hashtags from "./hashtags";

function Home() {
  const [tweets, setTweets] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isLoggedIn) navigate("/login");

  useEffect(() => {
    async function fetchTweets() {
      try {
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
      }
    }

    fetchTweets();
  }, []);

  return (
    <div className="container-fluid mt-3" style={{ paddingLeft: "120px" }}>
      <div className="row mt-3">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div>
            {/* Loop through tweets and create a Card for each */}
            {tweets.map((tweet, index) => (
              <Card
                key={index}
                userName={tweet.Username}
                userId={tweet.UserID}
                profilePic={tweet.AvatarURL}
                text={tweet.Content}
                tweetImage={tweet.ImageURL}
              />
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <Hashtags />
      </div>
    </div>
  );
}

export default Home;
