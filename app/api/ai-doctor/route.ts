import { NextResponse } from 'next/server';
import { generateHealthAdvice, analyzeMedicalDocument } from '@/lib/gemini';

// Server route so the Gemini key stays server-side. app/ai-doctor/page.tsx is a
// client component; importing lib/gemini there put the key in the browser bundle.
// The client now calls this route instead, and the key never leaves the server.

export const runtime = 'nodejs';

const MAX_INPUT = 20_000;

export async function POST(request: Request) {
  let body: { action?: string; prompt?: string; documentText?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Malformed JSON body' }, { status: 400 });
  }

  const { action, prompt, documentText } = body;

  if (action !== 'advice' && action !== 'analyze') {
    return NextResponse.json(
      { error: "action must be 'advice' or 'analyze'" },
      { status: 400 },
    );
  }

  const input = action === 'advice' ? prompt : documentText;

  if (typeof input !== 'string' || input.trim().length === 0) {
    const field = action === 'advice' ? 'prompt' : 'documentText';
    return NextResponse.json({ error: `${field} is required` }, { status: 400 });
  }

  if (input.length > MAX_INPUT) {
    return NextResponse.json(
      { error: `Input exceeds ${MAX_INPUT} characters` },
      { status: 413 },
    );
  }

  try {
    const text =
      action === 'advice'
        ? await generateHealthAdvice(input)
        : await analyzeMedicalDocument(input);
    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const misconfigured = message.includes('GEMINI_API_KEY');
    console.error('[ai-doctor]', message);
    return NextResponse.json(
      {
        error: misconfigured
          ? 'AI Doctor is not configured: GEMINI_API_KEY is not set on the server.'
          : 'The assistant could not complete that request.',
        // Surface a missing key explicitly — that one is actionable for whoever
        // is deploying it. Everything else stays generic.
        ...(misconfigured ? { reason: 'missing_api_key' } : {}),
      },
      { status: misconfigured ? 503 : 502 },
    );
  }
}