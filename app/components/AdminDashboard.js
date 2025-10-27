'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/lib/contexts/UserContext';
import Logo from './Logo';
import OnboardingBuilder from './OnboardingBuilder';

export default function AdminDashboard() {
  const { currentUser, logout } = useUser();
  const [onboardings, setOnboardings] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedOnboarding, setSelectedOnboarding] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load onboardings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin_onboardings');
    if (saved) {
      setOnboardings(JSON.parse(saved));
    } else {
      // Load mock data
      setOnboardings(getMockOnboardings());
    }
  }, []);

  // Save onboardings to localStorage
  useEffect(() => {
    localStorage.setItem('admin_onboardings', JSON.stringify(onboardings));
  }, [onboardings]);

  const getMockOnboardings = () => [
    {
      id: 'onboarding-SF-001',
      name: 'SAN FRANCISCO Engineering',
      code: 'SF',
      number: '001',
      description: 'Onboarding program for engineering team in San Fran office',
      createdAt: new Date('2025-10-20'),
      employees: [],
      enablePersonalityTest: true,
      enableAIBot: true,
      videos: [],
      documents: [],
      status: 'active',
    },
    {
      id: 'onboarding-BOS-002',
      name: 'BOSTON Sales Team',
      code: 'BOS',
      number: '002',
      description: 'Comprehensive onboarding for sales representatives',
      createdAt: new Date('2025-10-15'),
      employees: [],
      enablePersonalityTest: true,
      enableAIBot: true,
      videos: [],
      documents: [],
      status: 'active',
    },
    {
      id: 'onboarding-ATL-003',
      name: 'ATLANTA Product Team',
      code: 'ATL',
      number: '003',
      description: 'Product management onboarding program',
      createdAt: new Date('2025-10-10'),
      employees: [],
      enablePersonalityTest: false,
      enableAIBot: true,
      videos: [],
      documents: [],
      status: 'draft',
    },
  ];

  const handleCreateNew = () => {
    setSelectedOnboarding(null);
    setShowBuilder(true);
  };

  const handleEditOnboarding = (onboarding) => {
    setSelectedOnboarding(onboarding);
    setShowBuilder(true);
  };

  const handleSaveOnboarding = (onboarding) => {
    if (selectedOnboarding) {
      // Update existing
      setOnboardings(onboardings.map(o => o.id === onboarding.id ? onboarding : o));
    } else {
      // Create new
      setOnboardings([...onboardings, onboarding]);
    }
    setShowBuilder(false);
    setSelectedOnboarding(null);
  };

  const handleDeleteOnboarding = (id) => {
    if (window.confirm('Are you sure you want to delete this onboarding?')) {
      setOnboardings(onboardings.filter(o => o.id !== id));
    }
  };

  const filteredOnboardings = onboardings.filter(o =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showBuilder) {
    return (
      <OnboardingBuilder
        onboarding={selectedOnboarding}
        onSave={handleSaveOnboarding}
        onCancel={() => {
          setShowBuilder(false);
          setSelectedOnboarding(null);
        }}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="glass-morphism border-b border-gray-200/50 dark:border-gray-800/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-6" />
              <div className="hidden sm:block border-l border-gray-300 dark:border-gray-700 pl-3">
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {currentUser?.name}
                </h1>
                <p className="text-xs text-gray-500">Onboarding</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-8 animate-slideUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Onboarding Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and distribute employee onboarding programs
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Programs</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{onboardings.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{onboardings.filter(o => o.status === 'active').length}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Employees</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {onboardings.reduce((sum, o) => {
                const count = Array.isArray(o.employees) ? o.employees.length : o.employees || 0;
                return sum + count;
              }, 0)}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search onboardings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-openpurple-500 focus:ring-2 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30"
            />
            <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-6 py-2.5 bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 flex items-center gap-2 justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Onboarding
          </button>
        </div>

        {/* Onboardings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp" style={{ animationDelay: '0.3s' }}>
          {filteredOnboardings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6H6m0 0H0" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">No onboardings found</h3>
              <p className="text-gray-500 dark:text-gray-400">Create your first onboarding program</p>
            </div>
          ) : (
            filteredOnboardings.map((onboarding, idx) => (
              <div
                key={onboarding.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg hover:border-openpurple-300 dark:hover:border-openpurple-700 transition-all animate-slideUp"
                style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium text-openpurple-600 dark:text-openpurple-400 mb-1">
                      {onboarding.code}#{onboarding.number}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                      {onboarding.name}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    onboarding.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                  }`}>
                    {onboarding.status.charAt(0).toUpperCase() + onboarding.status.slice(1)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {onboarding.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div>
                    <div className="text-2xl font-bold text-openpurple-600 dark:text-openpurple-400">
                      {Array.isArray(onboarding.employees) ? onboarding.employees.length : onboarding.employees || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Employees</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {Array.isArray(onboarding.videos) ? onboarding.videos.length : onboarding.videos || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Videos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Array.isArray(onboarding.documents) ? onboarding.documents.length : onboarding.documents || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">Docs</div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5 mb-4 text-xs">
                  {onboarding.enablePersonalityTest && (
                    <span className="px-2 py-1 rounded bg-openpurple-100 dark:bg-openpurple-900/30 text-openpurple-700 dark:text-openpurple-400 font-medium">
                      Personality Test
                    </span>
                  )}
                  {onboarding.enableAIBot && (
                    <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                      AI Assistant
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditOnboarding(onboarding)}
                    className="flex-1 px-3 py-2 bg-openpurple-100 dark:bg-openpurple-900/30 hover:bg-openpurple-200 dark:hover:bg-openpurple-800/50 text-openpurple-700 dark:text-openpurple-300 rounded-lg font-medium text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOnboarding(onboarding.id)}
                    className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 rounded-lg font-medium text-sm transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
