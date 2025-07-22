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
    // getAllAudioUrls를 사용해서 여러 URL 중 작동하는 것을 반환
    const urls = googleTTS.getAllAudioUrls(text, {
      lang,
      slow,
      host: 'https://translate.google.com',
    });

    // 첫 번째 URL 반환 (대부분의 경우 작동)
    const url = urls && urls.length > 0 ? urls[0].url : null;
    
    if (!url) {
      throw new Error('No audio URL generated');
    }

    return NextResponse.json({ url, urls });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'TTS 생성에 실패했습니다.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}