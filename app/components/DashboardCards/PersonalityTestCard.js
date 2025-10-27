'use client';

import { MOCK_PERSONALITY_DATA } from '@/app/lib/mockData';

export default function PersonalityTestCard({ stats, onStart, onRefresh, onViewResults, onReset }) {
  const typeData = stats.personalityType ? MOCK_PERSONALITY_DATA.types[stats.personalityType] : null;

  return (
    <div className="group h-full bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-openpurple-300 dark:hover:border-openpurple-700 flex flex-col">
      {/* Icon & Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-openpurple-100 dark:bg-openpurple-900/30 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-openpurple-600 dark:text-openpurple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </div>
        {stats.personalityTestCompleted && (
          <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            Done
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Personality Test
      </h3>

      {/* Content - Flexible */}
      <div className="flex-1 mb-4">
        {stats.personalityTestCompleted && typeData ? (
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${typeData.bgLight} border ${typeData.borderColor}`}>
              <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${typeData.bgGradient}`}></div>
              <span className={`text-xs font-bold ${typeData.textColor}`}>
                {typeData.name}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {typeData.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-600 mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                {stats.personalityAttempts > 1 ? (
                  <span>Retaken {stats.personalityAttempts}x • Latest result</span>
                ) : (
                  <span>Completed</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Leadership personality assessment pending
          </p>
        )}
      </div>

      {/* Buttons */}
      {stats.personalityTestCompleted ? (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewResults();
            }}
            className="flex-1 px-3 py-2 text-xs font-medium bg-openpurple-50 dark:bg-openpurple-900/20 text-openpurple-700 dark:text-openpurple-400 hover:bg-openpurple-100 dark:hover:bg-openpurple-900/40 rounded-lg transition-colors border border-openpurple-200 dark:border-openpurple-800"
          >
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="flex-1 px-3 py-2 text-xs font-medium bg-openpurple-600 hover:bg-openpurple-700 text-white rounded-lg transition-colors"
          >
            Retake
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          className="w-full px-3 py-2 text-xs font-medium bg-openpurple-600 hover:bg-openpurple-700 text-white rounded-lg transition-colors"
        >
          Start
        </button>
      )}
    </div>
  );
}
