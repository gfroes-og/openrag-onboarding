import { NextResponse } from 'next/server';
import { VOICE_CONFIG, TTS_API_TOKEN } from '../../config/voices';

export async function POST(request) {
  try {
    const { text, language, voice: customVoice } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Use custom voice if provided, otherwise select based on language
    const voice = customVoice || VOICE_CONFIG[language] || VOICE_CONFIG['en'];

    const response = await fetch('https://tts.sendeasy.pro/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': TTS_API_TOKEN,
      },
      body: JSON.stringify({
        text: text,
        voice: voice,
        format: 'mp3',
        model: 'kokoro',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to generate speech', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return both the job ID and the full audio URL
    const audioUrl = `https://tts.sendeasy.pro${data.download_url}`;
    
    return NextResponse.json({
      id: data.id,
      status: data.status,
      download_url: data.download_url,
      audio_url: audioUrl,
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

