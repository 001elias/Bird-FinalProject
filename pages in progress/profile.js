import React from "react";
import "./profile.css";
import Logo from "../img/Harelogofinal202339.png";
import Card from "../components/card";

function UserProfile() {
  return (
    <div>
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
                  <section className="headsec">
                    <i className="fa fa-arrow-left" id="fa-arrow-left"></i>
                    <div>
                      <h3>Ayman Zriek</h3>
                      <span>38.7k Tweets</span>
                    </div>
                  </section>
                  <section className="twitterprofile">
                    <div className="headerprofileimage">
                      <img
                        src="https://res.cloudinary.com/dowrygm9b/image/upload/v1570267399/laptop-3174729_yiprzu.jpg"
                        alt="header"
                        id="headerimage"
                      />
                      <img
                        src="https://res.cloudinary.com/dowrygm9b/image/upload/v1570267399/laptop-3174729_yiprzu.jpg"
                        alt="profile pic"
                        id="profilepic"
                      />
                      <div className="editprofile">Edit Profile</div>
                    </div>
                    <div className="bio">
                      <div className="handle">
                        <h3>Ayman Zriek</h3>
                        <span>@Ayman_zk</span>
                      </div>
                      <p>Business Administration Student |</p>
                      <p>Front-end web developer |</p>
                      <p>Barça fan |</p>
                      <span>@Awelagos @4topsports</span> <br />
                      <span>
                        {" "}
                        <i className="fa fa-location-arrow "></i> Lagos,
                        Nigeria.{" "}
                        <a href="#">
                          {" "}
                          <i
                            className="fa fa-external-link"
                            aria-hidden="true"
                          ></i>
                          linkedin.com/in/segun-olani…{" "}
                        </a>{" "}
                        <i
                          className="fa fa-birthday-cake"
                          aria-hidden="true"
                        ></i>{" "}
                        Born November 10
                      </span>
                      <br />{" "}
                      <span>
                        <i className="fa fa-calendar"></i> Joined May 2013
                      </span>
                      <div className="nawa">
                        <div className="followers">
                          421 <span>Following</span>
                        </div>
                        <div>
                          1519<span> Followers</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="tweets">
                    <div className="heading">
                      <p>Posts</p>
                      <p>Replies</p>
                      <p>Likes</p>
                    </div>
                  </section>

                  <section className="mytweets">
        {/* Cards */}
        <div>
          {/* Loop through tweets and create a Card for each */}
          {tweets.map((tweet, index) => (
            <Card
              key={index}
              username={tweet.UserID}
              profilePic={tweet.ProfilePic}
              text={tweet.Content}
              tweetImage={tweet.TweetImage}
            />
          ))}
        </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="col-md-2 fixed-top ml-auto"
        style={{ paddingTop: "50px", zIndex: 1000 }}
      >
        <div className="rounded-box mt-3">
          <h3>Hashtags</h3>
          <div className="hashtag-btn">
            <button className="btn btn-secondary" id="hashtag">
              <span>#WebDevelopment</span>
            </button>
            <br />
            <span className="hashtagcontent">500 times</span>
          </div>
          <div className="hashtag-btn">
            <button className="btn btn-secondary" id="hashtag">
              <span>#HareIsLit</span>
            </button>
            <br />
            <span className="hashtagcontent">355 times</span>
          </div>
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
  );
}

export default UserProfile;
