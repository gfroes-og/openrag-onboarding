'use client';

import { useState } from 'react';
import { MOCK_VIDEOS, getUserProgress, markVideoAsWatched, unmarkVideoAsWatched } from '@/app/lib/mockData';

export default function VideoPlayerModal({ isOpen, onClose, onRefresh, userId }) {
  const progress = getUserProgress(userId);

  if (!isOpen) return null;

  const handleMarkAsWatched = (videoId, videoTitle) => {
    markVideoAsWatched(userId, videoId);
    onRefresh?.();
    alert(`✅ "${videoTitle}" marked as watched!`);
  };

  const handleUnmarkAsWatched = (videoId, videoTitle) => {
    unmarkVideoAsWatched(userId, videoId);
    onRefresh?.();
    alert(`↩️ "${videoTitle}" unmarked!`);
  };

  const handleWatchVideo = (url) => {
    window.open(url, '_blank');
  };

  const isVideoWatched = (videoId) => !!progress.videoWatched[videoId];

  // Group videos by category
  const videosByCategory = MOCK_VIDEOS.reduce((acc, video) => {
    if (!acc[video.category]) acc[video.category] = [];
    acc[video.category].push(video);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-openpurple-600 to-openpurple-700 text-white px-6 py-4 flex items-center justify-between border-b border-openpurple-700">
          <h2 className="text-xl font-semibold">Video Learning</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-openpurple-800 rounded-lg p-1.5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {Object.entries(videosByCategory).map(([category, videos]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Thumbnail */}
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer"
                          onClick={() => handleWatchVideo(video.url)}>
                          <span className="text-white text-3xl">▶</span>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                        {isVideoWatched(video.id) && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Watched
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {video.description}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleWatchVideo(video.url)}
                            className="flex-1 px-3 py-2 bg-openpurple-50 dark:bg-openpurple-900/20 text-openpurple-700 dark:text-openpurple-400 rounded-lg hover:bg-openpurple-100 dark:hover:bg-openpurple-900/40 text-xs font-medium transition-colors border border-openpurple-200 dark:border-openpurple-800 flex items-center justify-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                            Watch
                          </button>
                          {!isVideoWatched(video.id) ? (
                            <button
                              onClick={() => handleMarkAsWatched(video.id, video.title)}
                              className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 text-xs font-medium transition-colors border border-green-200 dark:border-green-800"
                            >
                              Mark as Watched
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnmarkAsWatched(video.id, video.title)}
                              className="flex-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-medium transition-colors border border-red-200 dark:border-red-800"
                            >
                              Unmark as Watched
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-white">
              {Object.keys(progress.videoWatched).length}
            </span>
            {' '}of {MOCK_VIDEOS.length} videos watched
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 text-white rounded-lg font-medium transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
