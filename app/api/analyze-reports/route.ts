import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API_KEY!);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const { files } = await request.json();

    // Download files from Supabase
    const downloadPromises = files.map(async (path: string) => {
      const { data, error } = await supabase.storage
        .from('reports')
        .download(path);
      
      if (error) throw error;
      return data;
    });

    const fileContents = await Promise.all(downloadPromises);

    // Convert files to base64 for Google AI
    const fileData = await Promise.all(
      fileContents.map(async (blob) => {
        const buffer = await blob.arrayBuffer();
        return {
          inlineData: {
            data: Buffer.from(buffer).toString('base64'),
            mimeType: blob.type
          }
        };
      })
    );

    // Initialize the model with safety settings
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro-vision',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Create a chat session
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: 'You are a medical report analyzer. Please analyze the reports I provide and give detailed insights.',
        },
        {
          role: 'model',
          parts: 'I\'ll help analyze medical reports with detailed insights, focusing on key findings, abnormalities, and recommendations.',
        },
      ],
    });

    // Send the analysis request
    const result = await chat.sendMessage([
      'Please analyze these medical reports and provide a structured analysis with the following sections:\n\n' +
      '1. SUMMARY\n' +
      '- Brief overview of the reports\n' +
      '- Type of tests/examinations\n\n' +
      '2. KEY FINDINGS\n' +
      '- Important observations\n' +
      '- Normal results\n' +
      '- Abnormal results\n\n' +
      '3. RISK ASSESSMENT\n' +
      '- Current health status\n' +
      '- Potential risks identified\n' +
      '- Severity levels\n\n' +
      '4. RECOMMENDATIONS\n' +
      '- Follow-up actions\n' +
      '- Lifestyle modifications\n' +
      '- Additional tests if needed\n\n' +
      '5. TRENDS\n' +
      '- Changes from previous results\n' +
      '- Progress indicators\n\n' +
      'Please format the response in a clear, structured manner.',
      ...fileData
    ]);

    const response = await result.response;
    const analysis = response.text();

    // Process the analysis text to create a structured response
    const sections = {
      summary: '',
      keyFindings: [],
      riskAssessment: {
        status: '',
        risks: [],
        severity: ''
      },
      recommendations: [],
      trends: []
    };

    // Simple parsing of the response (you can make this more sophisticated)
    const parts = analysis.split(/\d\.\s+/);
    if (parts.length >= 5) {
      sections.summary = parts[1].trim();
      sections.keyFindings = parts[2].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2));
      const riskParts = parts[3].split('\n').filter(line => line.trim());
      sections.riskAssessment = {
        status: riskParts[0] || '',
        risks: riskParts.slice(1).filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2)),
        severity: riskParts[riskParts.length - 1] || ''
      };
      sections.recommendations = parts[4].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2));
      sections.trends = parts[5] ? parts[5].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2)) : [];
    }

    return NextResponse.json({
      success: true,
      analysis: {
        raw: analysis,
        structured: sections
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze reports' },
      { status: 500 }
    );
  }
}
