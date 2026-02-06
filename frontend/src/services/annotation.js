// src/services/annotation.js
const API_URL = import.meta.env.VITE_ANNOTATION_API_URL || 'http://localhost:5001';

/**
 * Annotate text with uncertainty markers using the trained model
 * @param {string} text - Text to annotate
 * @param {boolean} showProbability - Show p-scores
 * @param {string} task - "auto", "fever", or "truthfulqa"
 * @returns {Promise<Object>} - Annotated text and footnotes
 */
export const annotateText = async (text, showProbability = true, task = 'auto') => {
  try {
    const response = await fetch(`${API_URL}/annotate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        show_probability: showProbability,
        task,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Annotation failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error annotating text:', error);
    throw error;
  }
};

/**
 * Check if annotation API is healthy
 * @returns {Promise<Object>} - Health status
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    
    if (!response.ok) {
      throw new Error('API unhealthy');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking API health:', error);
    return { status: 'unhealthy' };
  }
};
