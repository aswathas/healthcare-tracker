import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Get the model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    const result = await model.generateContent(fullPrompt);
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing medical document:', error);
    throw error;
  }
}
