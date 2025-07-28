import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const OAuthCallback = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(getErrorMessage(errorParam));
          setStatus('error');
          return;
        }

        if (!token) {
          setError('No authentication token received');
          setStatus('error');
          return;
        }

        // Verify token and get user data
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to verify authentication token');
        }

        const userData = await response.json();
        
        // Store token and login user
        localStorage.setItem('token', token);
        onLogin({
          token,
          user: userData.user
        });

        setStatus('success');
        
        // Redirect to main app after short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setError(error.message || 'Authentication failed');
        setStatus('error');
      }
    };

    handleOAuthCallback();
  }, [searchParams, onLogin, navigate]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'oauth_failed':
        return 'OAuth authentication failed. Please try again.';
      case 'oauth_error':
        return 'An error occurred during authentication. Please try again.';
      default:
        return 'Authentication failed. Please try again.';
    }
  };

  const handleRetry = () => {
    navigate('/login');
  };

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-liquid-blue to-liquid-purple">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl text-center">
          <div>
            <div className="mx-auto h-12 w-12 text-liquid-blue">
              <svg className="animate-spin h-12 w-12" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Completing Sign In
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please wait while we finish setting up your account...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-liquid-blue to-liquid-purple">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl text-center">
          <div>
            <div className="mx-auto h-12 w-12 text-green-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Successfully Signed In!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Redirecting to AetherOS...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-liquid-blue to-liquid-purple">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl text-center">
          <div>
            <div className="mx-auto h-12 w-12 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Authentication Failed
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
          </div>
          
          <div>
            <button
              onClick={handleRetry}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-liquid-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-liquid-blue"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;