const LLMClient = require('../llm/client');

class APIGenerator {
  constructor() {
    this.llmClient = new LLMClient();
  }

  async generate(prompt, options = {}, logger = null) {
    try {
      const generatedAPI = await this.llmClient.generateAPI(prompt, logger);
      
      // Parse and validate the OpenAPI specification
      const cleanedAPI = this.cleanupAPISpec(generatedAPI);
      
      logger?.debug('API generation completed', {
        originalLength: generatedAPI.length,
        cleanedLength: cleanedAPI.length
      });
      
      return {
        success: true,
        specification: cleanedAPI,
        spec: cleanedAPI, // Also provide as 'spec' for consistent response structure
        format: 'openapi',
        metadata: {
          timestamp: new Date().toISOString(),
          prompt: prompt,
          model: 'gpt-3.5-turbo'
        }
      };
    } catch (error) {
      logger?.error('API generation failed', { error: error.message });
      return {
        success: false,
        error: error.message || 'Failed to generate API specification'
      };
    }
  }

  cleanupAPISpec(apiSpec) {
    // Remove markdown code blocks if present
    let cleaned = apiSpec.replace(/^```ya?ml\n?/gm, '').replace(/\n?```$/gm, '');
    
    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();
    
    return cleaned;
  }

  validateOpenAPISpec(spec) {
    // Basic validation for OpenAPI structure
    try {
      const lines = spec.split('\n');
      const hasOpenAPIVersion = lines.some(line => line.includes('openapi:') || line.includes('swagger:'));
      const hasInfo = lines.some(line => line.includes('info:'));
      const hasPaths = lines.some(line => line.includes('paths:'));
      
      return hasOpenAPIVersion && hasInfo && hasPaths;
    } catch (error) {
      return false;
    }
  }
}

module.exports = APIGenerator;