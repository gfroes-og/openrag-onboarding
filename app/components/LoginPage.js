'use client';

import { useState } from 'react';
import { useUser } from '@/app/lib/contexts/UserContext';
import Logo from './Logo';

export default function LoginPage() {
  const { login } = useUser();
  const [email, setEmail] = useState('test@opengov.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('user'); // 'user' or 'admin'

  const handleModeChange = (mode) => {
    setLoginMode(mode);
    setError('');
    if (mode === 'user') {
      setEmail('test@opengov.com');
      setPassword('demo123');
    } else {
      setEmail('admin@opengov.com');
      setPassword('admin123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-openpurple-50 via-white to-openpurple-50 dark:from-gray-900 dark:via-gray-900 dark:to-openpurple-950 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-openpurple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-openpurple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center mb-6">
            <Logo className="h-12" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {loginMode === 'user' ? 'Welcome to your onboarding journey' : 'Administration'}
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleModeChange('user')}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
                loginMode === 'user'
                  ? 'text-openpurple-600 dark:text-openpurple-400 border-openpurple-600 dark:border-openpurple-400'
                  : 'text-gray-500 dark:text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => handleModeChange('admin')}
              className={`flex-1 px-4 py-3 font-semibold text-sm transition-all border-b-2 ${
                loginMode === 'admin'
                  ? 'text-openpurple-600 dark:text-openpurple-400 border-openpurple-600 dark:border-openpurple-400'
                  : 'text-gray-500 dark:text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Staff
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-openpurple-500 focus:ring-4 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30 transition-all duration-200"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-openpurple-500 focus:ring-4 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30 transition-all duration-200"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-openpurple-200 dark:focus:ring-openpurple-900/50 disabled:cursor-not-allowed shadow-lg shadow-openpurple-200 dark:shadow-openpurple-900/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:shadow-none disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 hidden">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {loginMode === 'user' ? 'Demo Credentials' : 'Admin Access'}
              </p>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <p>{loginMode === 'user' ? 'test@opengov.com' : 'admin@opengov.com'}</p>
                <p>{loginMode === 'user' ? 'demo123' : 'admin123'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Powered with 💙 by Guiggs</p>
        </div>
      </div>
    </div>
  );
}

