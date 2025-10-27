'use client';

export default function ProgressRing({ progress = 0, size = 200 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5257ff" />
            <stop offset="100%" stopColor="#3d33f8" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center text */}
      <div className="absolute text-center">
        <div className="text-4xl font-bold text-openpurple-600 dark:text-openpurple-400">
          {progress}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Overall Progress
        </div>
      </div>
    </div>
  );
}
