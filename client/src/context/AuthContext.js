// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  
  // This effect runs once on app load to check for a logged-in user
  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem('userInfo') 
      ? JSON.parse(localStorage.getItem('userInfo')) 
      : null;
      
    if (userInfoFromStorage) {
      setAuth(userInfoFromStorage);
    }
  }, []);

  // Function to handle user login
  const login = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setAuth(userInfo);
  };

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem('userInfo');
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;