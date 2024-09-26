import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Assuming you have `auth.isAuthenticated` in the Redux state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    sessionStorage.clear(); // Clear session when not authenticated
    return <Navigate to="/" />;
  }

  return children; // Return children if authenticated
};

export default ProtectedRoute;
