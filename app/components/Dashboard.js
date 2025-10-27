'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/lib/contexts/UserContext';
import { calculateProgressStats, MOCK_PERSONALITY_DATA, resetPersonalityTest } from '@/app/lib/mockData';
import PersonalityTestCard from './DashboardCards/PersonalityTestCard';
import ReadingMaterialsCard from './DashboardCards/ReadingMaterialsCard';
import VideoLearningCard from './DashboardCards/VideoLearningCard';
import AIAssistantCard from './DashboardCards/AIAssistantCard';
import ProgressRing from './ProgressRing';
import PersonalityTestModal from './Modals/PersonalityTestModal';
import PDFReaderModal from './Modals/PDFReaderModal';
import VideoPlayerModal from './Modals/VideoPlayerModal';
import Logo from './Logo';
import LoadingScreen from './LoadingScreen';

export default function Dashboard() {
  const { currentUser, logout } = useUser();
  const [stats, setStats] = useState(null);
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);
  const [viewResultsOnly, setViewResultsOnly] = useState(false);
  const [showPDFReader, setShowPDFReader] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Load stats on mount and when user changes
  useEffect(() => {
    if (currentUser?._id) {
      const newStats = calculateProgressStats(currentUser._id);
      setStats(newStats);
    }
  }, [currentUser]);

  const handleRefreshStats = () => {
    if (currentUser?._id) {
      const newStats = calculateProgressStats(currentUser._id);
      setStats(newStats);
    }
  };

  const handleResetTest = () => {
    if (currentUser?._id) {
      resetPersonalityTest(currentUser._id);
      handleRefreshStats();
    }
  };

  const handleWatchVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
  };

  if (!stats) {
    return <LoadingScreen message="Loading dashboard" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="glass-morphism sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-800/50">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Progress Overview */}
        <div className="mb-8 sm:mb-12 animate-slideUp">
          <div className="bg-gradient-to-br from-openpurple-50 to-white dark:from-openpurple-950/20 dark:to-gray-950 rounded-2xl p-6 sm:p-8 border border-openpurple-200/50 dark:border-openpurple-800/30 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              {/* Progress Ring */}
              <div className="flex-shrink-0">
                <ProgressRing progress={stats.overallProgress} size={160} />
              </div>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 gap-3 w-full">
                {[
                  { 
                    label: 'Assessment', 
                    value: stats.personalityTestCompleted ? stats.personalityTypeName : '—', 
                    desc: stats.personalityTestCompleted ? `Completed • ${stats.personalityAttempts}x` : 'Pending',
                    color: 'text-openpurple-600'
                  },
                  { 
                    label: 'Reading', 
                    value: `${stats.pdfRead}/${stats.totalPdfs}`, 
                    desc: `${stats.pdfProgress}% complete`,
                    color: 'text-openpurple-600'
                  },
                  { 
                    label: 'Videos', 
                    value: `${stats.videoWatched}/${stats.totalVideos}`, 
                    desc: `${stats.videoProgress}% complete`,
                    color: 'text-openpurple-600'
                  },
                  { 
                    label: 'AI Interaction', 
                    value: 'Active', 
                    desc: 'Chat enabled',
                    color: 'text-green-600 dark:text-green-400'
                  }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-800">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-500 uppercase tracking-wide">{stat.label}</div>
                    <div className={`text-lg sm:text-xl font-bold ${stat.color} dark:text-openpurple-400 mt-1`}>{stat.value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-600 mt-1">{stat.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <PersonalityTestCard
                stats={stats}
                onStart={() => {
                  setViewResultsOnly(false);
                  setShowPersonalityTest(true);
                }}
                onViewResults={() => {
                  setViewResultsOnly(true);
                  setShowPersonalityTest(true);
                }}
                onRefresh={handleRefreshStats}
                onReset={handleResetTest}
              />
            </div>

            <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <ReadingMaterialsCard
                stats={stats}
                onBrowse={() => setShowPDFReader(true)}
                onRefresh={handleRefreshStats}
              />
            </div>

            <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <VideoLearningCard
                stats={stats}
                onBrowse={() => setShowVideoPlayer(true)}
                onRefresh={handleRefreshStats}
              />
            </div>

          <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <AIAssistantCard />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showPersonalityTest && (
        <PersonalityTestModal
          isOpen={showPersonalityTest}
          onClose={() => {
            setShowPersonalityTest(false);
            setViewResultsOnly(false);
          }}
          onComplete={handleRefreshStats}
          userId={currentUser._id}
          viewResultsOnly={viewResultsOnly}
        />
      )}

      {showPDFReader && (
        <PDFReaderModal
          isOpen={showPDFReader}
          onClose={() => setShowPDFReader(false)}
          onRefresh={handleRefreshStats}
          userId={currentUser._id}
        />
      )}

      {showVideoPlayer && (
        <VideoPlayerModal
          isOpen={showVideoPlayer}
          onClose={() => {
            setShowVideoPlayer(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
          onRefresh={handleRefreshStats}
          userId={currentUser._id}
        />
      )}
    </div>
  );
}
