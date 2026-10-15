import { GoogleGenerativeAI } from '@google/generative-ai';

// `gemini-pro` was retired by Google. Naming it produces a 404 at request time,
// which reads as "the API key is wrong" and sends you rotating a good key.
const MODEL = 'gemini-1.5-flash';

// Built lazily so importing this module from a client component fails loudly
// instead of silently shipping an empty-key client into the browser bundle.
function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set on the server. Gemini must be called from a ' +
        'server route or server component — calling it from a client component ' +
        'would expose the key in the browser bundle. See lib/gemini.ts.'
    );
  }
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: MODEL });
}

export async function generateHealthAdvice(
  prompt: string,
  context?: { conditions?: string[]; medications?: string[]; testResults?: any }
) {
  try {
    // Create a context-aware prompt
    let fullPrompt = `As an AI healthcare assistant, please provide advice based on the following information:\n\n`;

    if (context) {
      if (context.conditions?.length) {
        fullPrompt += `Medical Conditions: ${context.conditions.join(', ')}\n`;
      }
      if (context.medications?.length) {
        fullPrompt += `Current Medications: ${context.medications.join(', ')}\n`;
      }
      if (context.testResults) {
        fullPrompt += `Recent Test Results: ${JSON.stringify(context.testResults, null, 2)}\n`;
      }
    }

    fullPrompt += `\nUser Question: ${prompt}\n\n`;
    fullPrompt += `Please provide a clear, concise response that is easy to understand. Include any relevant health tips or precautions.`;

    // Generate content
    const result = await getModel().generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating health advice:', error);
    throw error;
  }
}

export async function analyzeMedicalDocument(documentText: string) {
  try {
    const prompt = `Please analyze the following medical document and provide a clear summary. Focus on key findings, diagnoses, and recommendations:\n\n${documentText}\n\nPlease structure the response with these sections:\n1. Key Findings\n2. Diagnosis\n3. Recommendations\n4. Important Notes`;

    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing medical document:', error);
    throw error;
  }
}
