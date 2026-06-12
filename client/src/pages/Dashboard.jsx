import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-sec-dark text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-sec-darker rounded-xl border border-sec-gray p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sec-green to-teal-400">
              Welcome to AutoReport
            </h1>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="p-4 bg-sec-dark rounded-lg border border-sec-gray/50">
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <div className="space-y-2 text-sec-lightGray">
              <p><span className="text-sec-green">Name:</span> {user?.name}</p>
              <p><span className="text-sec-green">Email:</span> {user?.email}</p>
              <p><span className="text-sec-green">ID:</span> {user?.id || user?._id}</p>
            </div>
          </div>
        </div>

        <div className="bg-sec-darker rounded-xl border border-sec-gray p-6 text-center">
          <p className="text-sec-lightGray">
            Authentication successfully implemented. This is a barebones dashboard for the Auth Feature commit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
