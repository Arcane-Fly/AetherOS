const OpenAI = require('openai');

class LLMClient {
  constructor() {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      console.warn('WARNING: OpenAI API key not configured. Generation will fail.');
      return;
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateCompletion(messages, options = {}, logger = null) {
    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized - check API key configuration');
      }

      const model = options.model || 'gpt-3.5-turbo';
      const maxTokens = options.maxTokens || 2000;
      
      logger?.info('Starting OpenAI completion request', {
        model,
        maxTokens,
        messageCount: messages.length
      });

      const completion = await this.openai.chat.completions.create({
        model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      });

      const response = completion.choices[0].message.content;
      
      logger?.info('OpenAI completion successful', {
        model,
        responseLength: response.length,
        tokensUsed: completion.usage?.total_tokens || 'unknown'
      });

      return response;
    } catch (error) {
      logger?.error('OpenAI API error', { 
        error: error.message, 
        type: error.constructor.name,
        statusCode: error.status || 'unknown'
      });
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }

  async generateCode(prompt, language = null, logger = null) {
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
    }, logger);
  }

  async generateAPI(prompt, logger = null) {
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

    return this.generateCompletion([systemMessage, userMessage], {}, logger);
  }

  async generateUI(prompt, logger = null) {
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

    return this.generateCompletion([systemMessage, userMessage], {}, logger);
  }

  async generateCLI(prompt, logger = null) {
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

    return this.generateCompletion([systemMessage, userMessage], {}, logger);
  }
}

module.exports = LLMClient;