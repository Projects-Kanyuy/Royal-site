// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import VotePage from './pages/VotePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import ArtistPublicPage from './pages/ArtistPublicPage';
import UpdateProfilePage from './pages/UpdateProfilePage'; 
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const { auth } = useContext(AuthContext);
  const isLoggedIn = !!auth;

  return (
    <Router>
      <Routes>
        {/* Light Theme Routes */}
         <Route path="/artist/:id" element={<Layout navVariant="limited" theme="light" isLoggedIn={false}><ArtistPublicPage /></Layout>} />
        <Route path="/" element={<Layout theme="light" isLoggedIn={isLoggedIn}><HomePage /></Layout>} />
        <Route path="/register" element={<Layout theme="light" isLoggedIn={isLoggedIn}><RegisterPage /></Layout>} />
        <Route path="/contact" element={<Layout theme="light" isLoggedIn={isLoggedIn}><ContactPage /></Layout>} />
        <Route path="/profile" element={<Layout theme="light" isLoggedIn={isLoggedIn}><ProfilePage /></Layout>} />
        <Route path="/vote" element={<Layout theme="light" isLoggedIn={isLoggedIn}><VotePage /></Layout>} />
        <Route path="/update-profile" element={<Layout theme="light" isLoggedIn={isLoggedIn}><UpdateProfilePage /></Layout>} />
        <Route path="/leaderboard" element={<Layout theme="light" isLoggedIn={isLoggedIn}><LeaderboardPage /></Layout>} />
      </Routes>
      <WhatsAppButton />
    </Router>
  );
}

export default App;