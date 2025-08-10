import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { 
      correctAnswer, 
      userAnswer, 
      difficulty,
      environment 
    } = await request.json();

    if (!correctAnswer || !userAnswer) {
      return NextResponse.json(
        { error: 'Both correct and user answers are required' },
        { status: 400 }
      );
    }

    const prompt = `You are an English teacher analyzing a Korean student's mistake.

Correct answer: "${correctAnswer}"
Student's answer: "${userAnswer}"
Difficulty level: ${difficulty || '중간'}
Context: ${environment || '일반'}

Analyze why the student made this mistake and provide helpful feedback in Korean.

Focus on:
1. Word order mistakes (어순 오류)
2. Grammar mistakes (문법 오류)
3. Word choice mistakes (단어 선택 오류)
4. Missing or extra words (누락/추가 단어)

Response format (JSON):
{
  "mainError": "주요 오류 유형 (어순/문법/단어선택/누락)",
  "explanation": "왜 틀렸는지 간단한 설명 (2-3문장)",
  "tip": "이런 실수를 피하는 방법 (1-2문장)",
  "commonMistake": true/false (한국인이 자주 하는 실수인지)
}

Keep explanations simple and encouraging. Use Korean language.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are a supportive English teacher who helps Korean students learn from their mistakes. Always respond in Korean and be encouraging.'
        },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-5-nano',
      // GPT-5 models only support default temperature (1.0)
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error analyzing answer:', error);
    return NextResponse.json(
      { error: 'Failed to analyze answer' },
      { status: 500 }
    );
  }
}