import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function TweetForm() {
  const [tweet, setTweet] = useState("");
  const [image, setImage] = useState(null);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isLoggedIn) {
    console.log(isLoggedIn);
    navigate("/login");
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = "";

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      const uploadResponse = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      imageUrl = uploadData.imageUrl;
      console.log("File uploaded successfully:", imageUrl);
    }

    const tweetResponse = await fetch("/post-tweet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tweet, imageUrl }),
    });

    if (tweetResponse.ok) {
      // Handle successful tweet submission
      console.log("Tweet posted successfully");
      // Optionally reset the form
      setTweet("");
      setImage(null);
    } else {
      // Handle tweet post error
      console.error("Failed to post tweet");
    }
  };

  function handleChange(e) {
    setTweet(e.target.value);
  }

  return (
    <div class="container-fluid">
      <div class="row">
        <div className="col-md-1"></div>
        <div className="col-md-8">
          <div className="col-md-12">
            <p className="text-center">
              <h1>What do you have to say?</h1>
            </p>
          </div>
          <div className="col-md-12">
            <div className="container-textbox">
              <div className="Tweet-message text-box">
                <img
                  src="OIG2.jpg"
                  alt="Profile Picture"
                  className="profile-picture-textbox"
                />
                <form onSubmit={handleSubmit}>
                  <textarea
                    className="form-control"
                    rows="5"
                    maxlength="255"
                    onChange={handleChange}
                    value={tweet}
                    placeholder="Type your message here..."
                  ></textarea>
                  <div className="counter-container d-flex flex-column">
                    <div>
                      <label className="me-2">Attach picture</label>
                      <input type="file" onChange={handleImageChange} />
                      <button
                        className="btn btn-info float-right"
                        type="submit"
                      >
                        Post
                      </button>
                    </div>
                    <span>{tweet.length}/255</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}
export default TweetForm;
