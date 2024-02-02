import React, { useState, useEffect, useContext } from "react"; // Make sure the path to your CSS file is correct

import Card from "../../components/card";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
          {/* Cards */}
          <div>
            {/* Loop through tweets and create a Card for each */}
            {tweets.map((tweet, index) => (
              <Card
                key={index}
                username={tweet.UserID}
                profilePic={tweet.ProfilePic}
                text={tweet.Content}
                tweetImage={tweet.ImageURL}
              />
            ))}
          </div>
        </div>

        {/* Hashtags */}
        <div
          className="col-md-2 fixed-top ml-auto"
          style={{ paddingTop: "100px", zIndex: 1000 }}
        >
          <div className="rounded-box mt-3">
            <h3>Hashtags</h3>
            {/* Button 1 */}
            <div className="hashtag-btn">
              <button className="btn btn-secondary" id="hashtag">
                <span>#WebDevelopment</span>
              </button>
              <br />
              <span className="hashtagcontent">500 times</span>
            </div>
            {/* Button 2 */}
            <div className="hashtag-btn">
              <button className="btn btn-secondary" id="hashtag">
                <span>#HareIsLit</span>
              </button>
              <br />
              <span className="hashtagcontent">355 times</span>
            </div>
            {/* Button 3 */}
            <div className="hashtag-btn">
              <button className="btn btn-secondary" id="hashtag">
                <span>#RIPtwitter</span>
              </button>
              <br />
              <span className="hashtagcontent">214 times</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
