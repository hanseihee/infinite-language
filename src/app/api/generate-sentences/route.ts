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

    const prompt = `Generate 5 English sentences for language learning practice with the following criteria:
- Difficulty level: ${difficulty}
- Context/Environment: ${environment}
- Each sentence should be practical and commonly used in real situations
- Mix different sentence structures (questions, statements, requests)
- Return ONLY a JSON array of objects with "sentence" property
- No explanations or additional text

Example format:
[
  {"sentence": "Do you have this in another size?"},
  {"sentence": "I would like to make a reservation."},
  {"sentence": "How much does this cost?"},
  {"sentence": "Can you help me find the exit?"},
  {"sentence": "What time does the store close?"}
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
      const shuffledSentences = sentences.map((item: { sentence: string }, index: number) => {
        const words = item.sentence.replace(/[?!.]/g, '').split(' ');
        const shuffledWords = [...words].sort(() => Math.random() - 0.5);
        
        return {
          id: index + 1,
          shuffledWords,
          originalSentence: item.sentence
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