import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login/login";
import Register from "./pages/Register/register";
import Home from "./pages/Home/home";
import Navbar from "./components/navbar";
import TweetForm from "./pages/tweetForm";
import TopBar from "./components/topbar";
import Profile from "./pages/Profile/profile";
import Search from "./pages/search";
import Hashtags from "./components/hashtags";
import EditProfile from "./pages/Profile/editProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>
  );
}

function Main() {
  const { isLoggedIn, loggedUser } = useContext(AuthContext);

  // useEffect(() => {
  //   const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  //   setIsLoggedIn(loggedIn);
  // }, [setIsLoggedIn]);

  return (
    <>
      {isLoggedIn && (
        <>
          <TopBar userInfo={loggedUser} />
          <Navbar />
          <Hashtags />
        </>
      )}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Login />} />
        <Route path="/tweet" element={isLoggedIn ? <TweetForm /> : <Login />} />
        <Route
          path="/profile/:username"
          element={isLoggedIn ? <Profile /> : <Login />}
        />
        <Route
          path="/edit-profile/:username"
          element={isLoggedIn ? <EditProfile /> : <Login />}
        />
        <Route path="/search" element={isLoggedIn ? <Search /> : <Login />} />
        {/* ... other routes */}
      </Routes>
    </>
  );
}

export default App;
