import React, { useState } from 'react';
import { authService } from '../../services/auth';
import { GlassPanel, GlassButton, GlassInput } from '../ui/GlassPanel';
import { backgroundGradients } from '../../styles/glass-theme';
import { Cpu, Mail, Lock, User, Github } from 'lucide-react';
import type { LoginHandler } from '../../types/components';

interface AuthFormProps {
  onLogin: LoginHandler;
}

interface FormData {
  email: string;
  password: string;
  name: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOAuthLogin = (provider: string): void => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await authService.login(formData.email, formData.password);
      } else {
        response = await authService.register(formData.email, formData.password, formData.name);
      }
      onLogin(response);
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string, field: keyof FormData): void => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${backgroundGradients.cosmic} p-4`}
    >
      <GlassPanel className="max-w-md w-full p-8" gradient="default">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cpu className="w-10 h-10 text-white" />
            <h1 className="text-3xl font-bold text-white">AetherOS</h1>
          </div>
          <h2 className="text-xl font-semibold text-white/90 mb-2">Welcome to the Future</h2>
          <p className="text-white/70">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
              <GlassInput
                value={formData.name}
                onChange={(value) => handleChange(value, 'name')}
                placeholder="Enter your full name"
                icon={<User className="w-4 h-4" />}
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Email address</label>
            <GlassInput
              type="email"
              value={formData.email}
              onChange={(value) => handleChange(value, 'email')}
              placeholder="Enter your email"
              icon={<Mail className="w-4 h-4" />}
              required
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
            <GlassInput
              type="password"
              value={formData.password}
              onChange={(value) => handleChange(value, 'password')}
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              required
            />
          </div>

          {error && (
            <GlassPanel className="p-3" gradient="danger">
              <div className="text-sm text-white/90">{error}</div>
            </GlassPanel>
          )}

          <GlassButton type="submit" variant="primary" loading={loading} className="w-full">
            {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
          </GlassButton>

          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/10 backdrop-blur-sm text-white/70 rounded-full">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <GlassButton
                variant="secondary"
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </GlassButton>

              <GlassButton
                variant="secondary"
                onClick={() => handleOAuthLogin('github')}
                disabled={loading}
                className="flex items-center justify-center gap-2"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </GlassButton>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/80 hover:text-white text-sm underline transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </GlassPanel>
    </div>
  );
};

export default AuthForm;
