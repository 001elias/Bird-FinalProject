import React from "react";

function Hashtags() {
  return (
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
  );
}

export default Hashtags;
