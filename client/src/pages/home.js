import React from "react"; // Make sure the path to your CSS file is correct
import Logo from "../img/Harelogofinal202339.png";
function Home() {
  return (
    <div className="container-fluid mt-3">
      {/* Header */}
      <div className="row header" style={{ zIndex: 1000 }}>
        {/* Left-aligned column */}
        <div className="col-md-2 fixed-top text-left logo-container">
          <img
            src={Logo}
            alt="Left Image"
            className="img-fluid"
            style={{ maxHeight: "100px" }}
          />
        </div>

        {/* Centered column */}
        <div className="col-md-8 offset-md-2 text-center">
          <div className="input-group rounded-search-container">
            <input
              type="text"
              className="form-control rounded-search search-input"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Right-aligned column */}
        <div
          className="col-md-2 fixed-top ml-auto text-right"
          style={{ paddingRight: "30px", paddingTop: "20px" }}
        >
          <div className="d-flex align-items-center">
            <p className="text-white mb-0 flex-grow-1">Jen.Eric</p>
            <img
              src="OIG2.jpg"
              alt="User Picture"
              className="img-fluid rounded-circle mr-auto pl-2"
              style={{ height: "70px" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="row mt-3">
        {/* navbar */}
        {/* Center column */}
        <div
          className="col-md-8"
          style={{
            position: "sticky",
            top: "100px",
            paddingLeft: "50px",
            paddingRight: "0px",
          }}
        >
          {/* Cards */}
          <div className="card">
            <img
              src="OIG2 (1).jpg"
              alt="Profile Picture"
              className="card-profilepic"
            />
            <div className="card-body">
              <h5 className="card-title">chilldude22</h5>
              <p className="card-text">
                Accidentally put my phone in the fridge, and now it's on a cold
                call. Guess it wanted to chill with the veggies.
              </p>
              <img
                src="tweetimage1.jpg"
                alt="Content Image"
                className="img-fluid"
              />
            </div>
          </div>

          <div className="card">
            <img
              src="OIG4 (2).jpg"
              alt="Profile Picture"
              className="card-profilepic"
            />
            <div className="card-body">
              <h5 className="card-title">TinyTim420</h5>
              <p className="card-text">
                Created a fitness routine for couch potatoes. It involves
                lifting snacks to your mouth and perfecting the art of Netflix
                marathon sprints.
              </p>
            </div>
          </div>

          <div className="card">
            <img
              src="OIG4.jpg"
              alt="Profile Picture"
              className="card-profilepic"
            />
            <div className="card-body">
              <h5 className="card-title">buddhabuddha</h5>
              <p className="card-text">
                Trying to impress my crush by playing Overwatch. Accidentally
                triggered my ultimate in the spawn room. Talk about the
                "ultimate cringe"
              </p>
              <img
                src="tweetimage2.jpg"
                alt="Content Image"
                className="img-fluid"
              />
            </div>
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
