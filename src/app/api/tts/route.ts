import { NextRequest, NextResponse } from 'next/server';
import * as googleTTS from 'google-tts-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang') || 'en';
  const slow = searchParams.get('slow') === 'true';

  if (!text) {
    return NextResponse.json(
      { error: 'Text parameter is required' },
      { status: 400 }
    );
  }

  try {
    const url = googleTTS.getAudioUrl(text, {
      lang,
      slow,
      host: 'https://translate.google.com',
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'TTS 생성에 실패했습니다.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}