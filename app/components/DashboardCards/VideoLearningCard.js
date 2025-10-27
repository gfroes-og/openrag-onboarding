'use client';

export default function VideoLearningCard({ stats, onBrowse }) {
  const progressPercentage = stats.videoProgress;

  return (
    <div className="group h-full bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-openpurple-300 dark:hover:border-openpurple-700 flex flex-col">
      {/* Icon & Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-openpurple-100 dark:bg-openpurple-900/30 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-openpurple-600 dark:text-openpurple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </div>
        <span className="px-2 py-1 text-xs font-semibold bg-openpurple-100 dark:bg-openpurple-900/30 text-openpurple-700 dark:text-openpurple-400 rounded-full">
          {stats.videoWatched}/{stats.totalVideos}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Video Learning
      </h3>

      {/* Content - Flexible */}
      <div className="flex-1 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-xs font-semibold text-openpurple-600 dark:text-openpurple-400">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-openpurple-500 to-openpurple-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {stats.videoWatched === stats.totalVideos
              ? "All completed"
              : `${stats.totalVideos - stats.videoWatched} remaining`}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBrowse();
        }}
        className="w-full px-3 py-2 text-xs font-medium bg-openpurple-600 hover:bg-openpurple-700 text-white rounded-lg transition-colors"
      >
        Watch
      </button>
    </div>
  );
}
