const OpenAI = require('openai');

class LLMClient {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateCompletion(messages, options = {}) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: options.model || 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate completion');
    }
  }

  async generateCode(prompt, language = null) {
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI assistant that generates clean, functional, and well-documented code. 
      Always include proper error handling and follow best practices. 
      Respond only with the code, no explanations unless specifically requested.
      ${language ? `Generate code in ${language}.` : 'Choose the most appropriate programming language.'}`
    };

    const userMessage = {
      role: 'user',
      content: prompt
    };

    return this.generateCompletion([systemMessage, userMessage], {
      temperature: 0.3 // Lower temperature for more deterministic code generation
    });
  }

  async generateAPI(prompt) {
    const systemMessage = {
      role: 'system',
      content: `You are an expert API designer. Generate a complete REST API specification including:
      1. OpenAPI 3.0 specification in YAML format
      2. Endpoint definitions with proper HTTP methods
      3. Request/response schemas
      4. Error handling
      5. Authentication if needed
      Respond with the OpenAPI specification only.`
    };

    const userMessage = {
      role: 'user',
      content: prompt
    };

    return this.generateCompletion([systemMessage, userMessage]);
  }

  async generateUI(prompt) {
    const systemMessage = {
      role: 'system',
      content: `You are a React expert. Generate a complete React component with:
      1. Proper JSX structure
      2. State management using hooks
      3. Tailwind CSS for styling
      4. Responsive design
      5. Accessibility features
      6. TypeScript if complex
      Respond with the complete component code only.`
    };

    const userMessage = {
      role: 'user',
      content: prompt
    };

    return this.generateCompletion([systemMessage, userMessage]);
  }

  async generateCLI(prompt) {
    const systemMessage = {
      role: 'system',
      content: `You are a CLI tool expert. Generate a complete command-line tool with:
      1. Proper argument parsing
      2. Help documentation
      3. Error handling
      4. Modular structure
      5. Configuration options
      Choose the most appropriate language (Python, Node.js, Go, etc.) based on the requirements.
      Respond with the complete CLI tool code only.`
    };

    const userMessage = {
      role: 'user',
      content: prompt
    };

    return this.generateCompletion([systemMessage, userMessage]);
  }
}

module.exports = LLMClient;