import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  const { conditions } = await request.json();
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate 3-5 personalized health missions based on:
    Medical Conditions: ${JSON.stringify(conditions)}
    Format requirements:
    - Simple, actionable language
    - Measurable goals
    - Preventive focus
    - Max 15 words per mission`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const missions = text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^-\s*/, '').trim());

    return NextResponse.json({ missions });
  } catch (error) {
    console.error('Gemini Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate health missions' },
      { status: 500 }
    );
  }
}
