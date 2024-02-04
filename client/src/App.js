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
import Admin from "./pages/Admin/admin";

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
  const { isLoggedIn, setIsLoggedIn, loggedUser, setLoggedUser } =
    useContext(AuthContext);
  // useEffect(() => {
  //   const user = localStorage.getItem("loggedUser");

  //   if (user) {
  //     setLoggedUser(user);
  //   }
  //   const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  //   setIsLoggedIn(loggedIn);
  // }, [isLoggedIn]);

  //  useEffect(() => {
  //    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  //    setIsLoggedIn(loggedIn);
  //  }, [setIsLoggedIn]);

  function getHomePageComponent() {
    if (isLoggedIn) {
      if (!loggedUser.isAdmin) return <Home />;
      return <Admin />;
    } else {
      return <Login />;
    }
  }
  return (
    <>
      {isLoggedIn && (
        <>
          <TopBar userInfo={loggedUser} />
          <Navbar userInfo={loggedUser} />
          {!loggedUser.isAdmin && <Hashtags />}
        </>
      )}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={getHomePageComponent()} />
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
