import React, { useState } from "react";
function TweetForm() {
  const [tweet, setTweet] = useState("");
  const [image, setImage] = useState(null);

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

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        onChange={(e) => setTweet(e.target.value)}
        value={tweet}
      ></textarea>
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Post Tweet</button>
    </form>
  );
}
export default TweetForm;
