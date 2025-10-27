'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/lib/contexts/UserContext';
import { VOICE_CONFIG } from '../config/voices';
import SettingsModal from './SettingsModal';
import LoginPage from './LoginPage';
import Logo from './Logo';

export default function ChatInterface() {
  const router = useRouter();
  const { currentUser, loading, logout } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(null);
  const [audioCache, setAudioCache] = useState({});
  const [audioReady, setAudioReady] = useState({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showSources, setShowSources] = useState({});
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsMounted(true);

    const savedTheme = localStorage.getItem('theme') || 'system';
    const html = document.documentElement;
    
    if (savedTheme === 'dark') {
      html.classList.add('dark');
    } else if (savedTheme === 'light') {
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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleBack = () => {
    router.push('/');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        } 
      });
      
      const options = { mimeType: 'audio/webm;codecs=opus' };
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Transcribe the audio
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      
      if (data.text) {
        // Set the transcribed text in the input field
        setInput(data.text);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const pollAudioStatus = async (jobId, audioUrl, messageIndex, maxAttempts = 60) => {
    console.log(`Starting polling for job: ${jobId}`);
    console.log(`Audio URL will be: ${audioUrl}`);
    
    // Poll every 3 seconds, max 20 attempts (60 seconds total)
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      console.log(`Polling attempt ${attempt + 1}/${maxAttempts} for job: ${jobId}`);
      
      try {
        // Check job status via API
        const response = await fetch(`/api/tts/status?id=${jobId}`);
        
        if (!response.ok) {
          throw new Error('Failed to check status');
        }
        
        const data = await response.json();
        console.log(`Job status: ${data.status}`);
        
        if (data.status === 'done') {
          // Audio is ready!
          console.log(`Audio ready! Playing: ${audioUrl}`);
          setAudioCache(prev => ({ ...prev, [messageIndex]: audioUrl }));
          setAudioReady(prev => ({ ...prev, [messageIndex]: true }));
          setLoadingAudio(null);
          
          // Auto-play immediately
          playAudio(messageIndex, audioUrl);
          return;
        } else if (data.status === 'error') {
          // Generation failed
          console.error('Audio generation failed:', data.error);
          setLoadingAudio(null);
          return;
        }
        
        // Still processing (queued or processing), wait before next attempt
        console.log(`⏳ Job status: ${data.status}, waiting 3 seconds...`);
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error) {
        // API error, wait before next attempt
        console.log(`Status check error (attempt ${attempt + 1}/${maxAttempts}), waiting 3 seconds...`, error);
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    
    // Max attempts reached, stop loading
    console.error('⏱️ Audio generation timeout after 60 seconds');
    setLoadingAudio(null);
  };

  const generateAudio = async (messageIndex, text) => {
    // If already in cache, skip generation
    if (audioCache[messageIndex]) {
      return;
    }

    setLoadingAudio(messageIndex);

    try {
      // Get saved language preference, or default to 'en'
      const savedLanguage = localStorage.getItem('tts_language');
      const savedVoice = localStorage.getItem('tts_voice');
      
      let language = savedLanguage || 'en'; // Default to English if not set
      let voice = savedVoice;
      
      // If no saved voice, use default for the language
      if (!voice) {
        voice = VOICE_CONFIG[language];
      }

      // Request TTS generation
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language, voice }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      
      console.log('TTS API Response:', data);
      
      if (!data.id || !data.audio_url) {
        throw new Error('Invalid response from TTS API');
      }
      
      console.log(`Job ID: ${data.id}`);
      console.log(`Audio URL: ${data.audio_url}`);
      console.log(`Status: ${data.status}`);
      
      // Start polling the job status
      pollAudioStatus(data.id, data.audio_url, messageIndex);

    } catch (error) {
      console.error('Error generating audio:', error);
      setLoadingAudio(null);
    }
  };

  const playAudio = (messageIndex, audioUrl) => {
    // If already playing this message, stop it
    if (playingAudio === messageIndex) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingAudio(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Play the audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onplay = () => {
      setPlayingAudio(messageIndex);
    };

    audio.onended = () => {
      setPlayingAudio(null);
    };

    audio.onerror = (e) => {
      setPlayingAudio(null);
      console.error('Audio playback error:', e);
    };

    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
      setPlayingAudio(null);
    });
  };

  const handleAudioButtonClick = (messageIndex, text) => {
    const cachedUrl = audioCache[messageIndex];
    
    if (cachedUrl) {
      // Audio already generated, just play/pause
      playAudio(messageIndex, cachedUrl);
    } else {
      // Generate audio for the first time
      generateAudio(messageIndex, text);
    }
  };

  const toggleSources = (messageIndex) => {
    setShowSources(prev => ({
      ...prev,
      [messageIndex]: !prev[messageIndex]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage.content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Extract the response from Cloudflare's API structure
      const assistantContent = data.result?.response || data.response || 'No response received';
      let sources = data.result?.data || data.data || [];
      
      // Handle case where sources might be a JSON string
      if (typeof sources === 'string') {
        try {
          sources = JSON.parse(sources);
        } catch (e) {
          console.error('Failed to parse sources:', e);
          sources = [];
        }
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: assistantContent,
        data: sources,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted || !currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="glass-morphism sticky top-0 z-40 border-b border-gray-200/50 dark:border-gray-800/50 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-6" />
              <div className="hidden sm:block border-l border-gray-300 dark:border-gray-700 pl-3">
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                  AI Assistant
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-500">Get answers</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg hover:bg-openpurple-50 dark:hover:bg-openpurple-900/20 transition-colors"
                title="Settings"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-openpurple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={handleBack}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="space-y-3 md:space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center min-h-full py-8 animate-slideUp">
            <div className="text-center space-y-4 md:space-y-6 max-w-2xl px-4">
              
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-openpurple-400 rounded-full blur-2xl md:blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-openpurple-500 to-openpurple-700 shadow-2xl flex items-center justify-center animate-glow">
                  <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 9H6v2h2V9zm8 0h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-1.5 md:space-y-3">
                <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-openpurple-600 via-openpurple-700 to-openpurple-800 bg-clip-text text-transparent">
                  Welcome to OpenSearch
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-lg leading-relaxed">
                  Ask questions and get intelligent answers from  <b>OpenGov onboarding</b> docs.
                </p>
              </div>
              
              {/* Feature badge */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 justify-center pt-2 md:pt-4">
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-openpurple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Document Search</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-openpurple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Voice Input</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-openpurple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                  </svg>
                  <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Text-to-Speech</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex message-enter ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 md:px-5 py-3 md:py-3.5 shadow-sm transition-all duration-200 hover:shadow-md ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-openpurple-600 to-openpurple-700 text-white'
                  : message.isError
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-openpurple-50/60 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Action buttons for assistant messages */}
              {message.role === 'assistant' && !message.isError && (
                <div className="flex justify-end gap-1 mb-2">
                  {/* Info button for sources */}
                  {message.data && message.data.length > 0 && (
                    <button
                      onClick={() => toggleSources(index)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
                      title={showSources[index] ? "Hide sources" : "Show sources"}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Audio button */}
                  <button
                    onClick={() => handleAudioButtonClick(index, message.content)}
                    disabled={loadingAudio === index}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 hover:scale-110 active:scale-95"
                    title={
                      loadingAudio === index 
                        ? "Generating audio..." 
                        : playingAudio === index 
                        ? "Stop audio" 
                        : audioReady[index]
                        ? "Play audio"
                        : "Generate audio"
                    }
                  >
                    {loadingAudio === index ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : playingAudio === index ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </button>
                </div>
              )}
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
              
              {/* Source information display */}
              {message.role === 'assistant' && message.data && message.data.length > 0 && showSources[index] && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-openpurple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Sources</h4>
                  </div>
                  <div className="space-y-2">
                    {message.data.map((source, sourceIndex) => {
                      // Ensure source is an object and handle different data structures
                      if (!source || typeof source !== 'object') {
                        return (
                          <div key={sourceIndex} className="text-xs text-gray-600 dark:text-gray-400">
                            <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                              Source {sourceIndex + 1}
                            </div>
                            <div className="text-gray-500 dark:text-gray-500">
                              Invalid source data
                            </div>
                          </div>
                        );
                      }

                      // Extract text content safely
                      const getTextContent = (obj) => {
                        if (typeof obj === 'string') return obj;
                        if (obj && typeof obj === 'object') {
                          return obj.text || obj.content || obj.description || JSON.stringify(obj);
                        }
                        return String(obj || '');
                      };

                      const getTitle = (obj) => {
                        if (typeof obj === 'string') return obj;
                        if (obj && typeof obj === 'object') {
                          return obj.title || obj.filename || obj.name || `Source ${sourceIndex + 1}`;
                        }
                        return `Source ${sourceIndex + 1}`;
                      };

                      return (
                        <div key={sourceIndex} className="text-xs text-gray-600 dark:text-gray-400">
                          <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                            {getTitle(source)}
                          </div>
                          {source.content && (
                            <div className="text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                              {getTextContent(source.content)}
                            </div>
                          )}
                          {source.url && (
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-openpurple-600 hover:text-openpurple-700 dark:text-openpurple-400 dark:hover:text-openpurple-300 underline"
                            >
                              View source →
                            </a>
                          )}
                          {source.score && typeof source.score === 'number' && (
                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Relevance: {Math.round(source.score * 100)}%
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 text-xs opacity-50 mt-2.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span>
                  {new Date(message.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] w-full">
              {/* Shimmer skeleton */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer w-5/6"></div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex space-x-1.5">
                  <div className="w-2 h-2 bg-openpurple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-openpurple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-openpurple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-t from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 p-3 sm:p-6 animate-slideUp">
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto flex gap-2 sm:gap-3">
          {/* Record button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2.5 md:p-3 rounded-full transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl md:hover:scale-105 active:scale-95 ${
              isRecording
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white animate-pulse'
                : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-600 dark:text-gray-400 hover:from-openpurple-600 hover:to-openpurple-700 dark:hover:from-openpurple-600 dark:hover:to-openpurple-700 hover:text-white'
            }`}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            {isTranscribing ? (
              <svg className="w-5 h-5 md:w-6 md:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isRecording ? (
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </button>
          
          {/* Inpu */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTranscribing ? "Transcribing..." : "Ask a question..."}
            disabled={isLoading || isRecording || isTranscribing}
            className="flex-1 min-w-0 px-4 md:px-5 py-2.5 md:py-3 text-sm md:text-base rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-openpurple-500 focus:ring-4 focus:ring-openpurple-100 dark:focus:ring-openpurple-900/30 disabled:opacity-50 transition-all duration-200 shadow-sm"
          />
          
          {/* Send button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim() || isRecording || isTranscribing}
            className="p-2.5 md:px-6 md:py-3 bg-gradient-to-r from-openpurple-600 to-openpurple-700 hover:from-openpurple-700 hover:to-openpurple-800 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-openpurple-200 dark:focus:ring-openpurple-900/50 disabled:cursor-not-allowed shadow-lg shadow-openpurple-200 dark:shadow-openpurple-900/30 hover:shadow-xl md:hover:scale-105 active:scale-95 disabled:shadow-none disabled:hover:scale-100 flex-shrink-0"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        </div>
    </div>
  );
}

