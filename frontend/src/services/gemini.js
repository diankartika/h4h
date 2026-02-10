// src/services/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Generate answer from Gemini
 * @param {string} question - User's question
 * @returns {Promise<string>} - Generated answer
 */
export const generateAnswer = async (question) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: question }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating answer:', error);
    throw new Error('Failed to generate answer. Please try again.');
  }
};
