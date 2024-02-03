import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";

function Profile() {
  const { userName } = useParams();

  return <>Profile for {userName}</>;
}

export default Profile;
