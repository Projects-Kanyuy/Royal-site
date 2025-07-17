// src/components/Navbar.js
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Navbar = ({ variant = 'full', theme = 'light', isLoggedIn = false }) => {
  const isDark = theme === 'dark';
  const navBg = isDark ? 'bg-card-dark border-b border-gray-700' : 'bg-white shadow-sm';
  const textColor = isDark ? 'text-text-light' : 'text-text-dark';
  const activeLinkStyle = isDark ? 'text-brand-yellow-vote border-b-2 border-brand-yellow-vote' : 'text-brand-gold border-b-2 border-brand-gold';
  const hoverStyle = isDark ? 'hover:text-brand-yellow-vote' : 'hover:text-brand-gold';

  return (
    <header className={`h-20 flex justify-center items-center fixed top-0 w-full z-50 ${navBg}`}>
      <nav className="flex justify-between items-center w-full max-w-7xl mx-auto px-6">
        <Link to="/">
          <img src={logo} alt="ROCIMUC Logo" className="h-16" />
        </Link>
        
        {/* --- CONDITIONAL NAVIGATION LINKS --- */}
        {variant === 'full' ? (
          <ul className={`hidden md:flex items-center space-x-8 font-medium ${textColor}`}>
            <li><NavLink to="/" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)}>HOME</NavLink></li>
            <li><NavLink to="/register" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)}>REGISTER</NavLink></li>
            <li><NavLink to="/vote" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)}>VOTE</NavLink></li>
            <li><NavLink to="/leaderboard" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)}>LEADERBOARD</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)}>CONTACT</NavLink></li>
          </ul>
        ) : (
          <ul className={`hidden md:flex items-center space-x-8 font-medium ${textColor}`}>
            <li><NavLink to="/vote" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)}>VOTE</NavLink></li>
            <li><NavLink to="/leaderboard" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)}>LEADERBOARD</NavLink></li>
          </ul>
        )}
        
        {/* --- CONDITIONAL BUTTON --- */}
        {isLoggedIn && variant === 'full' ? (
          <Link to="/profile">
            <button className="bg-brand-yellow-vote text-black font-bold py-3 px-8 rounded-lg hover:brightness-90">UPDATE PROFILE</button>
          </Link>
        ) : variant === 'full' && !isLoggedIn ? (
          <Link to="/profile">
            <button className="bg-brand-yellow-vote text-black font-bold py-3 px-8 rounded-lg hover:brightness-90">LOGIN / PROFILE</button>
          </Link>
        ) : (
          // Render an empty div to maintain spacing if no button should be shown
          <div style={{ width: '150px' }}></div>
        )}
      </nav>
    </header>
  );
};
export default Navbar;