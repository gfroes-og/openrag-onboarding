'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';

export const UserContext = createContext(null);

// Mock users data
const MOCK_USERS = {
  'test@opengov.com': {
    _id: '1',
    name: 'Demo User',
    email: 'test@opengov.com',
    password: 'demo123',
    role: 'user',
    profile: {
      personalityResult: {
        type: 'Oracle',
        scores: { K: 6, N: 7, O: 9, W: 5 },
        takenAt: new Date('2025-10-20'),
        attempts: 1,
      },
    },
  },
  'admin@opengov.com': {
    _id: 'admin-1',
    name: 'Staff',
    email: 'admin@opengov.com',
    password: 'admin123',
    role: 'admin',
    department: 'Onboarding',
    profile: {},
  },
};

/* UserProvider component - Demo version with localStorage*/
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*Check if user is already logged in (from localStorage)*/
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check mock user
      const user = MOCK_USERS[email];
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newUser = {
        _id: String(Date.now()),
        name,
        email,
        profile: {
          personalityResult: null,
        },
      };

      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const logout = useCallback(async () => {
    try {
      setLoading(true);
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);


  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
