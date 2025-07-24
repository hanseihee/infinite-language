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

    const prompt = `Generate 5 unique English sentences for language learning practice with the following criteria:
- Difficulty level: ${difficulty}
- Context/Environment: ${environment}
**If ${difficulty} = "쉬움"**
- Use simple present, past, and future tenses only
- Vocabulary: 1000 most common English words
- Sentence length: 3-8 words maximum
- Grammar: Basic subject-verb-object patterns
- No idioms, phrasal verbs, or slang
- Examples: "I like coffee.", "Where is the bathroom?", "Can you help me?"

**If ${difficulty} = "중간"**
- Use present perfect, past continuous, conditionals
- Vocabulary: 2000-3000 most common words + some intermediate terms
- Sentence length: 6-12 words
- Grammar: Complex sentences with conjunctions, relative clauses
- Include basic phrasal verbs and simple idioms
- Examples: "I've been waiting for an hour.", "If I were you, I'd take the job."

**If ${difficulty} = "어려움"**
- Use advanced tenses (past perfect, future perfect, subjunctive)
- Vocabulary: Advanced words, technical terms, sophisticated expressions
- Sentence length: 10-15 words
- Grammar: Complex structures, passive voice, advanced conditionals
- Include advanced idioms, slang, cultural references
- Examples: "Had I known about the traffic, I would've left earlier.", "She's been burning the midnight oil lately."
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
  {"sentence": "Can I get the check please?", "korean": "계산서 주세요."},
  {"sentence": "Where is the nearest subway station?", "korean": "가장 가까운 지하철역이 어디인가요?"}
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