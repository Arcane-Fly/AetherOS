import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatInterface from './components/chat/ChatInterface';
import AuthForm from './components/auth/AuthForm';
import OAuthCallback from './components/auth/OAuthCallback';
import CreationHistory from './components/creation/CreationHistory';
import { authService } from './services/auth';
import type { User } from './types/auth';
import type { Creation } from './types/api';
import type { LoginHandler } from './types/components';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string): Promise<void> => {
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

  const handleLogin: LoginHandler = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = (): void => {
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading AetherOS...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {loading ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-xl text-gray-600">Loading AetherOS...</div>
          </div>
        ) : (
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <AuthForm onLogin={handleLogin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/oauth/callback" 
              element={<OAuthCallback onLogin={handleLogin} />} 
            />
            <Route 
              path="/" 
              element={
                user ? (
                  <div className="flex h-screen">
                    <div className="w-1/4 bg-white border-r border-gray-200 p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">AetherOS</h2>
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
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;