import { NextResponse } from 'next/server';
import { TTS_API_TOKEN } from '../../../config/voices';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');

    // Input validation
    if (!jobId || typeof jobId !== 'string') {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Validate job ID format (basic sanitization)
    if (!/^[a-f0-9\-]{36}$/i.test(jobId)) {
      return NextResponse.json(
        { error: 'Invalid job ID format' },
        { status: 400 }
      );
    }

    // Check status with the TTS service
    const response = await fetch(
      `https://tts.sendeasy.pro/status/${jobId}`,
      {
        method: 'GET',
        headers: {
          'x-api-token': TTS_API_TOKEN,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: 'Failed to check status', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('TTS Status API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

