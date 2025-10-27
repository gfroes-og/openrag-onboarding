'use client';

import { useState, useEffect } from 'react';
import { MOCK_PERSONALITY_DATA, savePersonalityResult, getUserProgress } from '@/app/lib/mockData';
import { IconCheck, IconTarget } from '@tabler/icons-react';

export default function PersonalityTestModal({ isOpen, onClose, onComplete, userId, viewResultsOnly = false }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ K: 0, N: 0, O: 0, W: 0 });
  const [testComplete, setTestComplete] = useState(viewResultsOnly);
  const [resultType, setResultType] = useState(null);

  // Load previous results if viewing results only
  useEffect(() => {
    if (viewResultsOnly && userId) {
      const progress = getUserProgress(userId);
      if (progress.personalityTest.completed) {
        setResultType(progress.personalityTest.currentType);
        setScores(progress.personalityTest.currentScores || { K: 0, N: 0, O: 0, W: 0 });
        setTestComplete(true);
      }
    }
  }, [viewResultsOnly, userId]);

  if (!isOpen) return null;

  const allQuestions = [];
  
  // Flatten the questions structure
  MOCK_PERSONALITY_DATA.questions.forEach(q => {
    if (q.sub_blocks) {
      q.sub_blocks.forEach(sub => {
        allQuestions.push({ block: q.block, options: sub.options });
      });
    } else {
      allQuestions.push(q);
    }
  });

  const types = MOCK_PERSONALITY_DATA.types;
  const currentQ = allQuestions[currentQuestion];
  const totalQuestions = allQuestions.length;

  const handleAnswerSelect = (value) => {
    const newScores = { ...scores, [value]: scores[value] + 1 };
    setScores(newScores);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const maxScore = Math.max(newScores.K, newScores.N, newScores.O, newScores.W);
      const type = Object.keys(newScores).find(key => newScores[key] === maxScore);
      
      savePersonalityResult(userId, type, newScores);
      setResultType(type);
      setTestComplete(true);
    }
  };

  const handleClose = () => {
    if (onComplete) onComplete();
    onClose();
  };

  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
        
        {/* Header*/}
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-openpurple-50 to-white dark:from-openpurple-950/20 dark:to-gray-950">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {testComplete ? 'Assessment Results' : 'Personality Assessment'}
              </h2>
              {!testComplete && <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Answer honestly • NO RIGHT OR WRONG ANSWERS • 4min</p>}
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {!testComplete && (
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-openpurple-500 to-openpurple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / allQuestions.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8">
          {!testComplete ? (
            <div className="space-y-6">
              {/* Question */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
                  {currentQ.block}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((option, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleAnswerSelect(option.id)} 
                      className="w-full text-left px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-openpurple-400 dark:hover:border-openpurple-500 hover:bg-openpurple-50 dark:hover:bg-openpurple-950/30 transition-all duration-150 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-4 h-4 rounded-full border-2 border-gray-400 group-hover:border-openpurple-600 dark:group-hover:border-openpurple-400 flex-shrink-0 transition-colors" />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                          {option.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {resultType && types[resultType] ? (
                <>
                  {/* Hero Section - Personality Type */}
                  <div className={`relative overflow-hidden rounded-2xl p-8 sm:p-12 bg-gradient-to-br ${types[resultType].bgGradient} shadow-lg`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]"></div>
                    </div>
                    
                    <div className="relative text-center space-y-4">
                      <div className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm">Your Personality Profile</div>
                      <div className="text-white text-6xl sm:text-7xl font-black drop-shadow-lg">{types[resultType].name}</div>
                      <div className="flex items-center justify-center gap-1.5">
                        <IconCheck className="w-5 h-5 text-white" />
                        <span className="text-white font-bold text-sm sm:text-base">{types[resultType].colorName} Profile</span>
                      </div>
                      <p className="text-white font-semibold text-base sm:text-lg drop-shadow-md">{types[resultType].description}</p>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-7 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <p className="text-gray-900 dark:text-white leading-relaxed text-center text-base sm:text-lg font-semibold italic">
                      &ldquo;{types[resultType].summary}&rdquo;
                    </p>
                  </div>

                  {/* Two Column Grid - Strengths & Areas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-l-4 border-green-500">
                      <h3 className="font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2 text-base">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Strengths
                      </h3>
                      <ul className="space-y-2.5">
                        {types[resultType].pros.map((pro, idx) => (
                          <li key={idx} className="text-gray-800 dark:text-gray-100 text-sm flex items-start gap-2.5 font-medium">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas to Consider */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-l-4 border-amber-500">
                      <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-2 text-base">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Areas for Growth
                      </h3>
                      <ul className="space-y-2.5">
                        {types[resultType].cons.map((con, idx) => (
                          <li key={idx} className="text-gray-800 dark:text-gray-100 text-sm flex items-start gap-2.5 font-medium">
                            <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5 flex-shrink-0">→</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Growth Guidance */}
                  <div className={`bg-white dark:bg-gray-900 rounded-xl p-6 border-l-4 ${types[resultType].borderColor}`}>
                    <h3 className={`font-semibold ${types[resultType].textColor} mb-3 flex items-center gap-2 text-base`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.243a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.757 15.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zM5.757 4.343a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" />
                      </svg>
                      Development Focus
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-sm font-medium">
                      {types[resultType].guidance}
                    </p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-center text-lg">Assessment Scores</h3>
                    <div className="space-y-3.5">
                      {Object.entries(scores).map(([type, score]) => {
                        const typeData = types[type];
                        const isHighest = resultType === type;
                        return (
                          <div key={type} className={`rounded-lg p-4 transition-all border-2 ${isHighest ? 'border-2 ' + typeData.borderColor + ' bg-gradient-to-r ' + typeData.bgGradient : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-br flex-shrink-0 ${typeData.bgGradient}`}></div>
                                <span className={`font-bold text-sm ${isHighest ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                  {typeData.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className={`font-bold text-base tabular-nums ${isHighest ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {score}/{totalQuestions}
                                </span>
                                <span className={`ml-2 text-sm font-semibold ${isHighest ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                                  ({Math.round((score / totalQuestions) * 100)}%)
                                </span>
                              </div>
                            </div>
                            <div className={`w-full rounded-full h-3 overflow-hidden ${isHighest ? 'bg-white/30' : 'bg-gray-300 dark:bg-gray-700'}`}>
                              <div
                                className={`h-3 rounded-full transition-all duration-500 ${isHighest ? 'bg-white' : 'bg-gray-400 dark:bg-gray-600'}`}
                                style={{ width: `${(score / totalQuestions) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendation, maybe just the admin is able to see this, IDK...  */}
                  {/* <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-l-4 border-blue-500">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-base">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v-1h8v1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Key Role Fit
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-medium">
                      This profile excels in roles requiring <span className="font-bold text-gray-900 dark:text-white">{types[resultType].description.toLowerCase()}</span>. Best suited for teams that value <span className="font-bold text-gray-900 dark:text-white">{types[resultType].name === 'King' ? 'decisive leadership' : types[resultType].name === 'Navigator' ? 'strategic planning' : types[resultType].name === 'Oracle' ? 'visionary thinking' : 'reliable support'}</span>.
                    </p>
                  </div> */}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-openpurple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading your results...</p>
                </div>
              )}
            </div>
          )}
         </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-6 sm:px-8 py-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
          {testComplete && (
            <button 
              onClick={handleClose} 
              className="w-full px-4 py-3 bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Close & Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
