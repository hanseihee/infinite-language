import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { difficulty, environment } = await request.json();

    if (!difficulty || !environment) {
      return NextResponse.json(
        { error: 'Difficulty and environment are required' },
        { status: 400 }
      );
    }

    const prompt = `Generate 10 unique English sentences for language learning practice with the following criteria:
- Difficulty level: ${difficulty}
- Context/Environment: ${environment}
- Each sentence should be practical and commonly used in real situations
- Mix different sentence structures (questions, statements, requests)
- Each sentence must be completely different from the others
- Return ONLY a JSON array of objects with "sentence" and "korean" properties
- No explanations or additional text

Example format:
[
  {"sentence": "Do you have this in another size?", "korean": "다른 사이즈가 있나요?"},
  {"sentence": "I would like to make a reservation.", "korean": "예약하고 싶습니다."},
  {"sentence": "How much does this cost?", "korean": "이것은 얼마인가요?"},
  {"sentence": "Can you help me find the exit?", "korean": "출구를 찾도록 도와주실 수 있나요?"},
  {"sentence": "What time does the store close?", "korean": "가게는 몇 시에 문 닫나요?"},
  {"sentence": "Could you please help me?", "korean": "도와주실 수 있나요?"},
  {"sentence": "Where is the nearest subway station?", "korean": "가장 가까운 지하철역이 어디인가요?"},
  {"sentence": "I need to exchange some money.", "korean": "환전을 해야 합니다."},
  {"sentence": "What would you recommend?", "korean": "무엇을 추천하시나요?"},
  {"sentence": "Can I get the check please?", "korean": "계산서 주세요."}
]`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    try {
      const sentences = JSON.parse(responseText);
      
      // Transform sentences into shuffled word arrays
      const shuffledSentences = sentences.map((item: { sentence: string; korean: string }, index: number) => {
        const words = item.sentence.replace(/[?!.]/g, '').split(' ').filter(word => word.length > 0);
        
        // Better shuffling algorithm - Fisher-Yates shuffle
        const shuffledWords = [...words];
        for (let i = shuffledWords.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
        }
        
        return {
          id: index + 1,
          shuffledWords,
          originalSentence: item.sentence,
          koreanTranslation: item.korean
        };
      });

      return NextResponse.json({ sentences: shuffledSentences });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse response from OpenAI' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error generating sentences:', error);
    return NextResponse.json(
      { error: 'Failed to generate sentences' },
      { status: 500 }
    );
  }
}