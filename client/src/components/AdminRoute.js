// src/components/AdminRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = () => {
  const { auth } = useContext(AuthContext);

  // If the user is logged in AND is an admin, show the page.
  // Otherwise, redirect them to the admin login page.
  return auth && auth.isAdmin ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export default AdminRoute;