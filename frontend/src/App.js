import React, { useState, useEffect } from 'react';
import ChatInterface from './components/chat/ChatInterface';
import AuthForm from './components/auth/AuthForm';
import CreationHistory from './components/creation/CreationHistory';
import { authService } from './services/auth';

function App() {
  const [user, setUser] = useState(null);
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const userData = await authService.verifyToken(token);
      setUser(userData.user);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading LiquidOS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <div className="flex h-screen">
          <div className="w-1/4 bg-white border-r border-gray-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">LiquidOS</h2>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
            <CreationHistory creations={creations} setCreations={setCreations} />
          </div>
          <div className="flex-1">
            <ChatInterface user={user} creations={creations} setCreations={setCreations} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;