// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

// Define the different sets of navigation links right here
const fullNavLinks = [
  { name: 'Home', path: '/' },
  { name: 'Register', path: '/register' },
  { name: 'Vote', path: '/vote' },
  { name: 'Leaderboard', path: '/leaderboard' },
  { name: 'Contact', path: '/contact' },
];

const supporterNavLinks = [
  { name: 'Vote', path: '/vote' },
  { name: 'Leaderboard', path: '/leaderboard' },
];

const Layout = ({ children, theme = 'light', isLoggedIn = false, isSupporter = false }) => {
  const contentBg = theme === 'dark' ? 'bg-bg-dark' : 'bg-bg-light';

  // The logic to decide which links to show is now inside the Layout
  const linksToShow = isSupporter ? supporterNavLinks : fullNavLinks;
  // The logic to decide if the login/profile button should be shown
  const shouldShowLoginButton = !isSupporter;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        links={linksToShow}
        showLoginButton={shouldShowLoginButton}
        theme={theme}
        isLoggedIn={isLoggedIn}
      />
      <main className={`flex-grow ${contentBg}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;