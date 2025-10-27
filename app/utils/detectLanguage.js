/**
 * Detects if text is primarily Portuguese or English
 * @param {string} text - Text to analyze
 * @returns {string} - 'pt-BR' or 'en'
 */
export function detectLanguage(text) {
  if (!text || text.trim().length === 0) {
    return 'en';
  }

  // Common Portuguese words and patterns
  const portugueseIndicators = [
    'é', 'à', 'ã', 'õ', 'ç', 'ê', 'â', 'ô',
    'não', 'são', 'está', 'será', 'você', 'também',
    'através', 'até', 'após', 'durante', 'entre',
    'sem', 'sobre', 'para', 'pelo', 'pela',
    'com', 'dos', 'das', 'nos', 'nas',
  ];

  // Common English words (that aren't typically Portuguese)
  const englishIndicators = [
    'the', 'and', 'that', 'have', 'with',
    'this', 'from', 'they', 'which', 'their',
    'would', 'there', 'could', 'should',
  ];

  const lowerText = text.toLowerCase();
  
  let portugueseScore = 0;
  let englishScore = 0;

  // Check for Portuguese indicators
  portugueseIndicators.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      portugueseScore += matches.length;
    }
  });

  // Check for English indicators
  englishIndicators.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      englishScore += matches.length;
    }
  });

  // Return the language with higher score
  return portugueseScore > englishScore ? 'pt-BR' : 'en';
}

