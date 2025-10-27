/**
 * Mock data for demo
 * Store progress in localStorage
 */

export const MOCK_PERSONALITY_DATA = {
  types: {
    K: {
      name: 'King',
      color: '#EF4444', // Red
      colorName: 'Red',
      bgGradient: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800',
      description: 'Leadership & Authority',
      summary: 'Natural leader with decisiveness, confidence, and strategic vision.',
      pros: [
        'Strong decision-making abilities',
        'Inspires and motivates others',
        'Commands presence and respect',
        'Takes charge in challenging situations'
      ],
      cons: [
        'Can be domineering or overly controlling',
        'May struggle with flexibility',
        'Risk of intimidating team members',
        'Tendency to prioritize results over relationships'
      ],
      guidance: 'Develop emotional intelligence and balance authority with humility. Practice active listening and create space for others to lead.'
    },
    N: {
      name: 'Navigator',
      color: '#3B82F6', // Blue
      colorName: 'Blue',
      bgGradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: 'Strategy & Foresight',
      summary: 'Strategic thinker with deep planning and analytical skills.',
      pros: [
        'Excellent at detailed strategic planning',
        'Strong problem-solving capabilities',
        'Prepared for multiple scenarios',
        'Thorough and methodical approach'
      ],
      cons: [
        'Can experience analysis paralysis',
        'Tendency to overthink decisions',
        'May hesitate to take action',
        'Risk of missing opportunities while planning'
      ],
      guidance: 'Balance planning with action, trust your instincts, and embrace flexibility. Set deadlines for decisions to avoid overthinking.'
    },
    O: {
      name: 'Oracle',
      color: '#EAB308', // Yellow
      colorName: 'Yellow',
      bgGradient: 'from-yellow-500 to-yellow-600',
      bgLight: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      description: 'Wisdom & Insight',
      summary: 'Visionary thinker with deep understanding and insight.',
      pros: [
        'Sees the bigger picture clearly',
        'Provides wisdom and valuable insights',
        'Anticipates future trends',
        'Connects ideas in innovative ways'
      ],
      cons: [
        'Can be detached from practical realities',
        'May struggle with immediate decisions',
        'Risk of being too abstract',
        'Difficulty translating vision into action'
      ],
      guidance: 'Ground your insights in the practical world and balance vision with execution. Partner with detail-oriented team members.'
    },
    W: {
      name: 'Warrior',
      color: '#10B981', // Green
      colorName: 'Green',
      bgGradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
      description: 'Stability & Dependability',
      summary: 'Calm and reliable, providing steadfast foundation.',
      pros: [
        'Highly reliable and consistent',
        'Maintains composure under pressure',
        'Provides stability for the team',
        'Creates safe, predictable environment'
      ],
      cons: [
        'Can be resistant to change',
        'Prefers familiar over innovative',
        'May appear inflexible at times',
        'Risk of missing growth opportunities'
      ],
      guidance: 'Embrace change as an opportunity and develop flexibility. View stability as a foundation for growth, not a barrier to it.'
    }
  },
  questions: [
    {
      block: 'How would you define yourself?',
      description: 'Choose the option that best describes you',
      sub_blocks: [
        { options: [{ id: 'N', text: 'Worried' }, { id: 'W', text: 'Coherent' }, { id: 'K', text: 'Decisive' }, { id: 'O', text: 'Extroverted' }] },
        { options: [{ id: 'K', text: 'Direct' }, { id: 'O', text: 'Persuasive' }, { id: 'W', text: 'Conciliatory' }, { id: 'N', text: 'Suspicious' }] },
        { options: [{ id: 'W', text: 'Patient' }, { id: 'O', text: 'Optimistic' }, { id: 'N', text: 'Realistic' }, { id: 'K', text: 'Assertive' }] },
        { options: [{ id: 'W', text: 'Calm' }, { id: 'N', text: 'Methodical' }, { id: 'K', text: 'Agile' }, { id: 'O', text: 'Confident' }] },
        { options: [{ id: 'N', text: 'Fair' }, { id: 'W', text: 'Reliable' }, { id: 'O', text: 'Warm' }, { id: 'K', text: 'Objective' }] },
        { options: [{ id: 'W', text: 'Modest' }, { id: 'K', text: 'Competitive' }, { id: 'O', text: 'Popular' }, { id: 'N', text: 'Logical' }] },
        { options: [{ id: 'K', text: 'Decisive' }, { id: 'O', text: 'Spontaneous' }, { id: 'N', text: 'Disciplined' }, { id: 'W', text: 'Peaceful' }] },
        { options: [{ id: 'K', text: 'Fast' }, { id: 'O', text: 'Persuasive' }, { id: 'N', text: 'Methodical' }, { id: 'W', text: 'Careful' }] },
        { options: [{ id: 'K', text: 'Demanding' }, { id: 'N', text: 'Systematic' }, { id: 'W', text: 'Stable' }, { id: 'O', text: 'Communicative' }] },
        { options: [{ id: 'K', text: 'Authoritative' }, { id: 'O', text: 'Disorganized' }, { id: 'N', text: 'Suspicious' }, { id: 'W', text: 'Predictable' }] },
        { options: [{ id: 'W', text: 'Calm' }, { id: 'N', text: 'Disciplined' }, { id: 'K', text: 'Bold' }, { id: 'O', text: 'Enthusiastic' }] },
        { options: [{ id: 'W', text: 'Thoughtful' }, { id: 'K', text: 'Visionary' }, { id: 'N', text: 'Detail-oriented' }, { id: 'O', text: 'Creative' }] },
        { options: [{ id: 'W', text: 'Routine' }, { id: 'K', text: 'Intimidating' }, { id: 'N', text: 'Suspicious' }, { id: 'O', text: 'Disorganized' }] },
        { options: [{ id: 'K', text: 'Impatient' }, { id: 'N', text: 'Worried' }, { id: 'W', text: 'Reserved' }, { id: 'O', text: 'Optimistic' }] },
        { options: [{ id: 'O', text: 'Friendly' }, { id: 'K', text: 'Demanding' }, { id: 'N', text: 'Organized' }, { id: 'W', text: 'Peaceful' }] },
        { options: [{ id: 'K', text: 'Competitive' }, { id: 'N', text: 'Dedicated' }, { id: 'O', text: 'Persuasive' }, { id: 'W', text: 'Patient' }] },
        { options: [{ id: 'O', text: 'Extroverted' }, { id: 'N', text: 'Observant' }, { id: 'W', text: 'Reserved' }, { id: 'K', text: 'Directive' }] },
        { options: [{ id: 'K', text: 'Objective' }, { id: 'W', text: 'Calm' }, { id: 'O', text: 'Excited' }, { id: 'N', text: 'Careful' }] },
        { options: [{ id: 'O', text: 'Attentive' }, { id: 'K', text: 'Determined' }, { id: 'N', text: 'Perfectionist' }, { id: 'W', text: 'Loyal' }] },
        { options: [{ id: 'K', text: 'Practical' }, { id: 'N', text: 'Analytical' }, { id: 'O', text: 'Charismatic' }, { id: 'W', text: 'Discreet' }] },
      ]
    },
    {
      block: 'I think that...',
      options: [
        { id: 'O', text: 'United we stand, divided we fall' },
        { id: 'K', text: 'The best defense is a good offense' },
        { id: 'W', text: 'It\'s good to be gentle, but carry a big stick' },
        { id: 'N', text: 'A man prepared is worth two' }
      ]
    },
    {
      block: 'Which phrase do you like best?',
      options: [
        { id: 'W', text: 'It\'s better to look before you leap' },
        { id: 'O', text: 'Two heads are better than one' },
        { id: 'N', text: 'When we have standards, the chances of mistakes decrease greatly' },
        { id: 'K', text: 'Winning is fundamental' }
      ]
    },
    {
      block: 'Which of these options defines you best?',
      options: [
        { id: 'N', text: 'I am strict with myself' },
        { id: 'W', text: 'I like to feel part of the team' },
        { id: 'O', text: 'I like to interact and please the team' },
        { id: 'K', text: 'I am driven by results' }
      ]
    },
    {
      block: 'I try to act in a...',
      options: [
        { id: 'K', text: 'Practical, Fast, and Decisive' },
        { id: 'O', text: 'Persuasive, Optimistic, and Creative' },
        { id: 'W', text: 'Patient, Careful, and Reliable' },
        { id: 'N', text: 'Organized, Realistic, and Dedicated' }
      ]
    },
    {
      block: 'I need to have ... to feel good',
      options: [
        { id: 'K', text: 'Control' },
        { id: 'O', text: 'Approval' },
        { id: 'W', text: 'Routine' },
        { id: 'N', text: 'Standard' }
      ]
    }
  ]
};

export const MOCK_PDFS = [
  {
    id: '1',
    title: 'OpenGov Culture Guide 2025',
    category: 'Culture',
    fileName: 'culture-guide-2025.pdf',
    url: '/culture-guide-2025.pdf',
    size: '24 MB',
    pages: 32,
  },
  {
    id: '2',
    title: 'The OpenGov Way - Values Framework',
    category: 'Values',
    fileName: 'opengov-way-2025.pdf',
    url: '/opengov-way-2025.pdf',
    size: '2.0 MB',
    pages: 28,
  },
  {
    id: '3',
    title: 'Zac Bookman User Manual',
    category: 'Leadership',
    fileName: 'zac-bookman-user-manual.pdf',
    url: '/zac-bookman-user-manual.pdf',
    size: '215 KB',
    pages: 5,
  },
  {
    id: '4',
    title: 'Stanford Case Study',
    category: 'Company Story',
    fileName: 'stanford-case-study.pdf',
    url: '/stanford-case-study.pdf',
    size: '1.7 MB',
    pages: 48,
  },
  {
    id: '5',
    title: 'Guide to Local Government and Finance',
    category: 'Industry Knowledge',
    fileName: 'local-government-finance-guide.pdf',
    url: '/local-government-finance-guide.pdf',
    size: '926 KB',
    pages: 42,
  },
  {
    id: '6',
    title: 'About OpenGov',
    category: 'Company',
    fileName: 'about-opengov.txt',
    url: '/about-opengov.txt',
    size: '3.2 KB',
    pages: 1,
  },
];

export const MOCK_VIDEOS = [
  {
    id: '1',
    title: 'Welcome to OpenGov',
    category: 'Introduction',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=280&fit=crop',
    duration: '5:30',
    description: 'Get to know OpenGov and our mission',
  },
  {
    id: '2',
    title: 'Company Culture Deep Dive',
    category: 'Culture',
    url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=280&fit=crop',
    duration: '12:45',
    description: 'Understanding our values and culture',
  },
  {
    id: '3',
    title: 'Technology Stack Overview',
    category: 'Technology',
    url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=280&fit=crop',
    duration: '15:20',
    description: 'Our technology and architecture',
  },
  {
    id: '4',
    title: 'Benefits and Compensation',
    category: 'HR',
    url: 'https://www.youtube.com/watch?v=ZrMD63g-YGI',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=280&fit=crop',
    duration: '8:15',
    description: 'Everything about benefits and comp',
  },
  {
    id: '5',
    title: 'Remote Work Best Practices',
    category: 'Work',
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=280&fit=crop',
    duration: '10:00',
    description: 'Tips for working remotely',
  },
  {
    id: '6',
    title: 'Your First Week Guide',
    category: 'Onboarding',
    url: 'https://www.youtube.com/watch?v=oUFJJNQGwhk',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=280&fit=crop',
    duration: '7:30',
    description: 'What to expect in your first week',
  },
];


export function getUserProgress(userId) {
  try {
    const progress = localStorage.getItem(`progress_${userId}`);
    return progress ? JSON.parse(progress) : getInitialProgress();
  } catch (error) {
    console.error('Error getting progress:', error);
    return getInitialProgress();
  }
}


export function getInitialProgress() {
  return {
    personalityTest: {
      completed: false,
      attempts: 0,
      lastTakenAt: null,
      currentType: null,
    },
    pdfRead: {},
    videoWatched: {},
  };
}


export function saveUserProgress(userId, progress) {
  try {
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}


export function markPdfAsRead(userId, pdfId) {
  const progress = getUserProgress(userId);
  progress.pdfRead[pdfId] = {
    readAt: new Date().toISOString(),
  };
  saveUserProgress(userId, progress);
  return progress;
}


export function markVideoAsWatched(userId, videoId) {
  const progress = getUserProgress(userId);
  progress.videoWatched[videoId] = {
    watchedAt: new Date().toISOString(),
  };
  saveUserProgress(userId, progress);
  return progress;
}


export function savePersonalityResult(userId, type, scores) {
  const progress = getUserProgress(userId);
  progress.personalityTest = {
    completed: true,
    attempts: (progress.personalityTest.attempts || 0) + 1,
    lastTakenAt: new Date().toISOString(),
    currentType: type,
    currentScores: scores,
  };
  saveUserProgress(userId, progress);
  return progress;
}


export function resetPersonalityTest(userId) {
  const progress = getUserProgress(userId);
  progress.personalityTest = {
    completed: false,
    attempts: progress.personalityTest.attempts || 0,
    lastTakenAt: null,
    currentType: null,
    currentScores: null,
  };
  saveUserProgress(userId, progress);
  return progress;
}


export function unmarkPdfAsRead(userId, pdfId) {
  const progress = getUserProgress(userId);
  if (progress.pdfRead && progress.pdfRead[pdfId]) {
    delete progress.pdfRead[pdfId];
  }
  saveUserProgress(userId, progress);
  return progress;
}


export function unmarkVideoAsWatched(userId, videoId) {
  const progress = getUserProgress(userId);
  if (progress.videoWatched && progress.videoWatched[videoId]) {
    delete progress.videoWatched[videoId];
  }
  saveUserProgress(userId, progress);
  return progress;
}


export function calculateProgressStats(userId) {
  const progress = getUserProgress(userId);
  const pdfRead = Object.keys(progress.pdfRead || {}).length;
  const videoWatched = Object.keys(progress.videoWatched || {}).length;
  const totalPdfs = MOCK_PDFS.length;
  const totalVideos = MOCK_VIDEOS.length;

  const overallProgress = Math.round(
    ((pdfRead + videoWatched + (progress.personalityTest.completed ? 1 : 0)) /
      (totalPdfs + totalVideos + 1)) *
      100
  );

  const personalityTypeKey = progress.personalityTest.currentType;
  const personalityTypeName = personalityTypeKey ? MOCK_PERSONALITY_DATA.types[personalityTypeKey]?.name : null;

  return {
    personalityTestCompleted: progress.personalityTest.completed,
    personalityType: personalityTypeKey,
    personalityTypeName,
    personalityAttempts: progress.personalityTest.attempts,
    pdfRead,
    totalPdfs,
    pdfProgress: totalPdfs > 0 ? Math.round((pdfRead / totalPdfs) * 100) : 0,
    videoWatched,
    totalVideos,
    videoProgress: totalVideos > 0 ? Math.round((videoWatched / totalVideos) * 100) : 0,
    overallProgress,
  };
}
