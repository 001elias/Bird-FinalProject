import React from "react";

function Spinner() {
  return (
    <h2>
      Loading..
      <i className="fa fa-refresh fa-spin" style={{ fontSize: "50px" }}></i>
    </h2>
  );
}

export default Spinner;
