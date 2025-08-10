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

    // 난이도별 스펙 정의
    type LevelSpec = {
      words: string;
      grammar: string;
      vocab: string;
      avoid?: string;
      include?: string;
    };
    
    const levelSpecs: Record<string, LevelSpec> = {
      '쉬움': {
        words: '3-8',
        grammar: 'simple tenses only',
        vocab: 'basic 1000 words',
        avoid: 'idioms, phrasal verbs'
      },
      '중간': {
        words: '6-12',
        grammar: 'perfect/continuous/conditionals',
        vocab: '3000 words + phrasal verbs',
        include: 'common idioms'
      },
      '어려움': {
        words: '10-15',
        grammar: 'all tenses + subjunctive',
        vocab: 'advanced + idioms',
        include: 'cultural expressions'
      }
    };

    // 환경별 컨텍스트
    const contextExamples: Record<string, string[]> = {
      '일상': ['morning routine', 'weekend plans', 'weather chat', 'hobbies'],
      '회사': ['meeting request', 'deadline talk', 'project update', 'team lunch'],
      '쇼핑': ['price check', 'size inquiry', 'return policy', 'discount'],
      '여행': ['directions', 'check-in', 'local tips', 'transportation'],
      '레스토랑': ['reservation', 'order', 'dietary needs', 'bill payment'],
      '병원': ['symptoms', 'appointment', 'prescription', 'insurance'],
      '학교': ['homework', 'schedule', 'grades', 'activities'],
      '공항': ['boarding', 'baggage', 'customs', 'delays']
    };

    const spec = levelSpecs[difficulty] || levelSpecs['중간'];
    const context = contextExamples[environment] || ['general conversation'];

    const prompt = `Create 5 ${difficulty} English sentences for ${environment}.

Rules:
- ${spec.words} words per sentence
- Use ${spec.grammar}
- Vocabulary: ${spec.vocab}
- Mix: questions (2), statements (2), requests (1)
- Topics: ${context.join(', ')}
- Each sentence must be unique
${spec.avoid ? `- Avoid: ${spec.avoid}` : ''}
${spec.include ? `- Include: ${spec.include}` : ''}

Format: [{"sentence":"...", "korean":"..."}]`;

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'English teacher for Korean learners. Create practical, varied sentences suitable for real-life situations.'
        },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-5-mini'
      // GPT-5 models only support default temperature (1.0)
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