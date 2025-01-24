import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Store user details in localStorage
  const isAuthenticated = user?.token;
  const hasAccess = allowedRoles.includes(user?.role);

  if (!isAuthenticated || !hasAccess) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;