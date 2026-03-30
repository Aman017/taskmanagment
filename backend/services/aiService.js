const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  async improveDescription(title, description) {
    try {
      // Check if API key exists
      if (!this.apiKey) {
        console.error('GROQ_API_KEY is not set in environment variables');
        throw new Error('API key not configured');
      }

      const prompt = `Improve this task description to make it clearer, more actionable, and concise.
      
Task Title: ${title}
Current Description: ${description || 'No description provided'}

Please provide an improved version that:
1. Clarifies the objective
2. Makes it actionable with clear steps
3. Keeps it concise (max 100 words)
4. Maintains professional tone

Improved Description:`;

      console.log('Calling Groq API with prompt:', prompt);
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that improves task descriptions to make them clearer, more actionable, and professional. Always respond with only the improved description, no additional text.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      let improvedDescription = response.data.choices[0].message.content.trim();
      improvedDescription = improvedDescription.replace(/^["']|["']$/g, '');
      
      console.log('AI improved description:', improvedDescription);
      return improvedDescription;
      
    } catch (error) {
      console.error('AI Service Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return a fallback response instead of throwing error
      return this.getFallbackImprovement(title, description);
    }
  }

  // Fallback method when AI API fails
  getFallbackImprovement(title, description) {
    const fallbackDescriptions = [
      `${title}: This task requires attention and completion. Please ensure all requirements are met and deliverables are submitted on time.`,
      `Complete ${title} according to specifications. Focus on quality and timely delivery.`,
      `Address ${title} by following best practices and ensuring all acceptance criteria are met.`,
      `${title} - Priority task that needs to be completed with attention to detail and quality standards.`
    ];
    
    return fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)];
  }
}

module.exports = new AIService();