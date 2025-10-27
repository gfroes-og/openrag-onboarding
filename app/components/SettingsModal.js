'use client';

import { useState, useEffect, useCallback } from 'react';
import { AVAILABLE_VOICES, VOICE_CONFIG } from '../config/voices';

export default function SettingsModal({ isOpen, onClose }) {
  const [language, setLanguage] = useState('en');
  const [voice, setVoice] = useState('');
  const [theme, setTheme] = useState('system');

  // Apply theme to document
  const applyTheme = useCallback((newTheme) => {
    const html = document.documentElement;
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else if (newTheme === 'light') {
      html.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Load settings from localStorage
      const savedLanguage = localStorage.getItem('tts_language') || 'en';
      const savedVoice = localStorage.getItem('tts_voice') || VOICE_CONFIG[savedLanguage];
      const savedTheme = localStorage.getItem('theme') || 'system';
      setLanguage(savedLanguage);
      setVoice(savedVoice);
      setTheme(savedTheme);
    }
  }, [isOpen]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyTheme('system');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    // Set default voice for the selected language
    const defaultVoice = VOICE_CONFIG[newLanguage];
    setVoice(defaultVoice);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSave = () => {
    localStorage.setItem('tts_language', language);
    localStorage.setItem('tts_voice', voice);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    onClose();
  };

  const handleReset = () => {
    localStorage.removeItem('tts_language');
    localStorage.removeItem('tts_voice');
    localStorage.removeItem('theme');
    setLanguage('en');
    setVoice(VOICE_CONFIG['en']);
    setTheme('system');
    applyTheme('system');
  };

  if (!isOpen) return null;

  const availableVoices = AVAILABLE_VOICES[language] || [];
  const currentVoice = availableVoices.find(v => v.value === voice);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-openpurple-600 to-openpurple-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </h2>
              <p className="text-openpurple-100 text-sm mt-1">Customize your audio experience</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95"
              title="Close"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-220px)] overflow-y-auto">
          {/* Theme Selection */}
          <div>
            <label className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-openpurple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
              </svg>
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  theme === 'light' 
                    ? 'border-openpurple-500 bg-gradient-to-r from-openpurple-50 to-openpurple-100 dark:from-openpurple-900/30 dark:to-openpurple-800/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-openpurple-300 dark:hover:border-openpurple-700'
                }`}
              >
                <svg className={`w-6 h-6 mb-1.5 ${theme === 'light' ? 'text-openpurple-600' : 'text-gray-600 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                </svg>
                <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>Light</span>
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  theme === 'dark' 
                    ? 'border-openpurple-500 bg-gradient-to-r from-openpurple-50 to-openpurple-100 dark:from-openpurple-900/30 dark:to-openpurple-800/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-openpurple-300 dark:hover:border-openpurple-700'
                }`}
              >
                <svg className={`w-6 h-6 mb-1.5 ${theme === 'dark' ? 'text-openpurple-600' : 'text-gray-600 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>Dark</span>
              </button>

              <button
                onClick={() => handleThemeChange('system')}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  theme === 'system' 
                    ? 'border-openpurple-500 bg-gradient-to-r from-openpurple-50 to-openpurple-100 dark:from-openpurple-900/30 dark:to-openpurple-800/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-openpurple-300 dark:hover:border-openpurple-700'
                }`}
              >
                <svg className={`w-6 h-6 mb-1.5 ${theme === 'system' ? 'text-openpurple-600' : 'text-gray-600 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"/>
                </svg>
                <span className={`text-xs font-medium ${theme === 'system' ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>System</span>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-openpurple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd"/>
              </svg>
              Audio Language (TTS)
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  language === 'en' 
                    ? 'border-openpurple-500 bg-gradient-to-r from-openpurple-50 to-openpurple-100 dark:from-openpurple-900/30 dark:to-openpurple-800/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-openpurple-300 dark:hover:border-openpurple-700'
                }`}
              >
                <div className="flex-shrink-0 text-3xl">🇺🇸</div>
                <div className="ml-4 flex-1 text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">English (American)</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Default language</div>
                </div>
                {language === 'en' && (
                  <svg className="w-6 h-6 text-openpurple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>

              <button
                onClick={() => handleLanguageChange('pt-BR')}
                className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                  language === 'pt-BR' 
                    ? 'border-openpurple-500 bg-gradient-to-r from-openpurple-50 to-openpurple-100 dark:from-openpurple-900/30 dark:to-openpurple-800/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-openpurple-300 dark:hover:border-openpurple-700'
                }`}
              >
                <div className="flex-shrink-0 text-3xl">🇧🇷</div>
                <div className="ml-4 flex-1 text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">Português (Brasil)</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Portuguese language</div>
                </div>
                {language === 'pt-BR' && (
                  <svg className="w-6 h-6 text-openpurple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Voice Selection */}
          <div>
            <label className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-openpurple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
              </svg>
              Voice
            </label>
            
            {/* Voice cards grid */}
            <div className="space-y-2">
              {availableVoices.map((v) => (
                <button
                  key={v.value}
                  onClick={() => setVoice(v.value)}
                  className={`w-full flex items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] active:scale-95 ${
                    voice === v.value
                      ? 'border-openpurple-500 bg-gradient-to-r from-openpurple-50 to-openpurple-100 dark:from-openpurple-900/30 dark:to-openpurple-800/30 shadow-sm'
                      : 'border-gray-200 dark:border-gray-600 hover:border-openpurple-300 dark:hover:border-openpurple-700'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {v.gender === 'male' ? (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">{v.label}</div>
                  </div>
                  {voice === v.value && (
                    <svg className="w-5 h-5 text-openpurple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span>⭐⭐⭐ = Premium quality · ⭐⭐ = Good quality</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-openpurple-50 to-purple-50 dark:from-openpurple-900/20 dark:to-purple-900/20 border border-openpurple-200 dark:border-openpurple-800 rounded-xl p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-openpurple-600 dark:text-openpurple-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  The selected language will be used to convert all AI responses to audio. 
                  Default is <strong className="text-openpurple-700 dark:text-openpurple-400">English (American)</strong> with <strong className="text-openpurple-700 dark:text-openpurple-400">Michael</strong> voice.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 text-white font-semibold transition-all duration-200 shadow-lg shadow-openpurple-200 dark:shadow-openpurple-900/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

