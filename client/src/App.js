import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/Home/home";
import Navbar from "./components/navbar";
import TweetForm from "./pages/tweetForm";
import TopBar from "./pages/topbar";
import Profile from "./pages/profile";
import Search from "./pages/search";

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
        <Route path="/search" element={isLoggedIn ? <Search /> : <Login />} />
        {/* ... other routes */}
      </Routes>
    </>
  );
}

export default App;
