// src/components/Navbar.js
import React, { useState, useContext } from 'react'; // Import useContext
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { FaBars, FaTimes } from 'react-icons/fa';
import AuthContext from '../context/AuthContext'; // Import the AuthContext

const Navbar = ({ theme = 'light' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- THIS IS THE ADDED LOGIC ---
  const { auth } = useContext(AuthContext);
  const isLoggedIn = !!auth;
  const isAdmin = auth?.isAdmin;

  // Determine the correct link for the profile/login button
  const profileLink = isLoggedIn ? (isAdmin ? '/admin/dashboard' : '/profile') : '/profile';
  // --- END OF ADDED LOGIC ---

  const isDark = theme === 'dark';
  const navBg = isDark ? 'bg-card-dark border-b border-gray-700' : 'bg-white shadow-sm';
  const textColor = isDark ? 'text-text-light' : 'text-text-dark';
  const darkActiveLinkStyle = 'text-brand-yellow-vote';
  const lightActiveLinkStyle = 'text-brand-gold font-bold';
  const activeLinkStyle = isDark ? darkActiveLinkStyle : lightActiveLinkStyle;
  const hoverStyle = isDark ? 'hover:text-brand-yellow-vote' : 'hover:text-brand-gold';

  const navLinks = (
    <>
      <li><NavLink to="/" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)} onClick={() => setIsMenuOpen(false)}>HOME</NavLink></li>
      <li><NavLink to="/register" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)} onClick={() => setIsMenuOpen(false)}>REGISTER</NavLink></li>
      <li><NavLink to="/leaderboard" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)} onClick={() => setIsMenuOpen(false)}>LEADERBOARD</NavLink></li>
      <li><NavLink to="/contact" className={({ isActive }) => (isActive ? activeLinkStyle : hoverStyle)} onClick={() => setIsMenuOpen(false)}>CONTACT</NavLink></li>
    </>
  );

  return (
    <header className={`h-20 flex justify-center items-center fixed top-0 w-full z-50 transition-colors duration-300 ${navBg}`}>
      <nav className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 md:px-6">
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <img src={logo} alt="ROCIMUC Logo" className="h-16" />
        </Link>
        <ul className={`hidden md:flex items-center space-x-8 font-medium ${textColor}`}>
          {navLinks}
        </ul>
        
        {/* --- DESKTOP BUTTON NOW USES THE SMART 'profileLink' --- */}
        <div className="hidden md:block">
            <Link to={profileLink}>
                <button className="bg-brand-gold text-white font-bold py-2 px-6 rounded-md hover:bg-brand-gold-light">
                    {isLoggedIn ? 'PROFILE' : 'LOGIN'}
                </button>
            </Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`text-2xl ${textColor}`}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className={`md:hidden fixed top-20 right-0 h-[calc(100vh-80px)] w-2/3 max-w-sm ${navBg} ${textColor} transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out shadow-lg`}>
          <ul className="flex flex-col items-center justify-center h-full space-y-8 text-xl font-medium">
            {navLinks}
            <li className="pt-8">
              {/* --- MOBILE BUTTON NOW USES THE SMART 'profileLink' --- */}
              <Link to={profileLink} onClick={() => setIsMenuOpen(false)}>
                <button className="bg-brand-yellow-vote text-black font-bold py-3 px-12 rounded-lg">
                  {isLoggedIn ? 'PROFILE' : 'LOGIN'}
                </button>
              </Link>
            </li>
             {/* Add a separate Admin Login link on mobile if not logged in */}
             {!isLoggedIn && (
              <li>
                <Link to="/admin-login" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-400 hover:underline">
                  Admin Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;