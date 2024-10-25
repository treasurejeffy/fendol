import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate} from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((store) => store.authenticated);

  if (!auth) {
    sessionStorage.clear('authToken'); // Clear authToken when navigating to login
    return <Navigate to="/" />;
  }else{
    return children;
  }

 
};

export default ProtectedRoute;
