// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import ArtistPublicPage from './pages/ArtistPublicPage'; // This matches your file name
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';

function App() {
  const { auth } = useContext(AuthContext);
  const isLoggedIn = !!auth;

  return (
    <Router>
      <Routes>
        {/* --- Public User Routes --- */}
        <Route path="/" element={<Layout theme="light" isLoggedIn={isLoggedIn}><HomePage /></Layout>} />
        <Route path="/register" element={<Layout theme="light" isLoggedIn={isLoggedIn}><RegisterPage /></Layout>} />
        <Route path="/leaderboard" element={<Layout theme="light" isLoggedIn={isLoggedIn}><LeaderboardPage /></Layout>} />
        <Route path="/profile" element={<Layout theme="light" isLoggedIn={isLoggedIn}><ProfilePage /></Layout>} />
        <Route path="/contact" element={<Layout theme="light" isLoggedIn={isLoggedIn}><ContactPage /></Layout>} />
        <Route path="/artist/:id" element={<Layout theme="light" isLoggedIn={isLoggedIn}><ArtistPublicPage /></Layout>} />
        
        {/* --- Admin Routes --- */}
        <Route path="/admin-login" element={<Layout theme="light"><AdminLoginPage /></Layout>} />
        
        {/* This special route protects all admin pages inside it */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<Layout theme="light"><AdminDashboardPage /></Layout>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;