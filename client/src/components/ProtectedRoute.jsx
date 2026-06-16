import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  // While the initial silent refresh is trying to fetch an access token, wait
  if (isLoading) {
    return (
      <div className="min-h-screen bg-sec-dark flex flex-col justify-center items-center text-white">
        <Activity className="w-12 h-12 text-sec-green animate-pulse mb-4" />
        <h2 className="text-xl font-bold tracking-tight">Authenticating...</h2>
      </div>
    );
  }

  // If silent refresh finishes and there's still no user, they aren't authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, user is authenticated, render the requested route
  return children;
};

export default ProtectedRoute;
