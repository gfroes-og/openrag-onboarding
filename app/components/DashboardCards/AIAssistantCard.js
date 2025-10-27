'use client';

import { useRouter } from 'next/navigation';

export default function AIAssistantCard() {
  const router = useRouter();

  const handleOpenChat = () => {
    // Navigate to chat page (we'll create this route)
    router.push('/chat');
  };

  return (
    <div className="group h-full bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-openpurple-300 dark:hover:border-openpurple-700 cursor-pointer flex flex-col"
      onClick={handleOpenChat}>
      {/* Icon & Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-openpurple-100 dark:bg-openpurple-900/30 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-openpurple-600 dark:text-openpurple-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
          Ready
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        AI Assistant
      </h3>

      {/* Content - Flexible */}
      <div className="flex-1 mb-4">
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          Ask about OpenGov, your role, or onboarding
        </p>
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleOpenChat();
        }}
        className="w-full px-3 py-2 text-xs font-medium bg-openpurple-600 hover:bg-openpurple-700 text-white rounded-lg transition-colors"
      >
        Open Chat
      </button>
    </div>
  );
}
