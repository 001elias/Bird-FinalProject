import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your page components
import Login from './pages/login';
import Register from './pages/register';
//import Home from './pages/Home';
//import AdminUsers from './pages/AdminUsers';
// ... import other pages

function App() {
  return (
    <Router>
      {/* Optional: Add common components like Header or Navbar here */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ... define other routes */}
      </Routes>
    </Router>
  );
}

export default App;