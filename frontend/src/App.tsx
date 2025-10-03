import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ChatInterface from './components/chat/ChatInterface';
import AuthForm from './components/auth/AuthForm';
import OAuthCallback from './components/auth/OAuthCallback';
import CreationHistory from './components/creation/CreationHistory';
import { GlassPanel } from './components/ui/GlassPanel';
import { backgroundGradients } from './styles/glass-theme';
import { authService } from './services/auth';
import type { User } from './types/auth';
import type { Creation } from './types/api';
import type { LoginHandler } from './types/components';
import { LogOut, Cpu } from 'lucide-react';

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
      <div
        className={`min-h-screen ${backgroundGradients.cosmic} flex items-center justify-center`}
      >
        <GlassPanel className="p-8" gradient="dark">
          <div className="flex items-center gap-3 text-white">
            <Cpu className="w-6 h-6 animate-pulse" />
            <div className="text-xl font-medium">Loading AetherOS...</div>
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen ${backgroundGradients.aurora}`}>
        {loading ? (
          <div
            className={`min-h-screen ${backgroundGradients.cosmic} flex items-center justify-center`}
          >
            <GlassPanel className="p-8" gradient="dark">
              <div className="flex items-center gap-3 text-white">
                <Cpu className="w-6 h-6 animate-pulse" />
                <div className="text-xl font-medium">Loading AetherOS...</div>
              </div>
            </GlassPanel>
          </div>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={!user ? <AuthForm onLogin={handleLogin} /> : <Navigate to="/" />}
            />
            <Route path="/oauth/callback" element={<OAuthCallback onLogin={handleLogin} />} />
            <Route
              path="/"
              element={
                user ? (
                  <div className="flex h-screen p-4 gap-4">
                    {/* Sidebar */}
                    <div className="w-1/4 min-w-80">
                      <GlassPanel className="h-full p-4" gradient="default">
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-6 h-6 text-white" />
                            <h2 className="text-xl font-bold text-white">AetherOS</h2>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                        <CreationHistory creations={creations} setCreations={setCreations} />
                      </GlassPanel>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <GlassPanel className="h-full" gradient="default">
                        <ChatInterface
                          user={user}
                          creations={creations}
                          setCreations={setCreations}
                        />
                      </GlassPanel>
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
