'use client';

import { useEffect, useState } from 'react';
import { useUser } from './lib/contexts/UserContext';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import LoadingScreen from './components/LoadingScreen';

export default function Home() {
  const { currentUser, loading, isAdmin } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!isMounted || loading) {
    return <LoadingScreen message="Loading your dashboard" />;
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return isAdmin ? <AdminDashboard /> : <Dashboard />;
}
