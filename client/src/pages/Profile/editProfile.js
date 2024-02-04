import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getUserProfile } from "../../api/apis";
import Spinner from "../../components/spinner";
import { AuthContext } from "../../context/AuthContext";
import "./profile.css";

/* Edit a profile form */
function EditProfile() {
  const { username } = useParams();
  const { setLoggedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserProfile(username).then((data) => {
      if (data) setProfileInfo(data[0]);
      setLoading(false);
    });
  }, []);

  function handleImageChange(e) {
    setImage(e.target.files[0]);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    let avatarUrl = profileInfo.AvatarURL;

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      const uploadResponse = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      avatarUrl = uploadData.imageUrl;
    }
    console.log("File uploaded successfully:", avatarUrl);

    const saveResponse = await fetch("/save-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileInfo, avatarUrl }),
    });

    if (saveResponse.ok) {
      setLoggedUser({ ...profileInfo, AvatarURL: avatarUrl }); // Update the context's state
      navigate("/profile/" + profileInfo.Username);
      setError(null);
    } else {
      setError("Failed to save profile");
    }
  }

  function handleChange(e) {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  }

  return (
    <div className="container-fluid mt-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="flexcontainer">
              <div className="middlecontainer">
                {!profileInfo ? (
                  <Spinner />
                ) : (
                  <div>
                    <Link
                      to={`/profile/${profileInfo.Username}`}
                      className="btn btn-light float-right mt-2 text-dark"
                    >
                      <i class="fa fa-arrow-left mr-2"></i> Back to Profile
                    </Link>
                    <h2>Edit Profile</h2>
                    <div className="mt-4">
                      <form onSubmit={handleSaveProfile}>
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Avatar
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="file"
                              className="form-control"
                              onChange={handleImageChange}
                            />
                            <img
                              src={profileInfo.AvatarURL}
                              className="profile-picture-small"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Full Name
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control"
                              value={profileInfo.Fullname}
                              name="Fullname"
                              onChange={handleChange}
                              maxLength="255"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Location
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control"
                              value={profileInfo.Location}
                              name="Location"
                              onChange={handleChange}
                              maxLength="255"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            About me
                          </label>
                          <div className="col-sm-10">
                            <textarea
                              className="form-control"
                              value={profileInfo.Bio}
                              name="Bio"
                              onChange={handleChange}
                              maxLength="255"
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Social Network Url
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              className="form-control"
                              value={profileInfo.SocialURL}
                              name="SocialURL"
                              maxLength="400"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-sm-10">
                            <button type="submit" className="btn btn-primary">
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                      {error && <h3 className="alert alert-danger">{error}</h3>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
