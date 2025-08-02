const LLMClient = require('../llm/client');
const { getDefaultModel } = require('../config/models');

class UIGenerator {
  constructor() {
    this.llmClient = new LLMClient();
  }

  async generate(prompt, options = {}, logger = null) {
    try {
      const generatedUI = await this.llmClient.generateUI(prompt, logger);
      
      // Clean up the generated UI component
      const cleanedUI = this.cleanupUICode(generatedUI);
      
      return {
        success: true,
        component: cleanedUI,
        framework: 'react',
        styling: 'tailwind',
        metadata: {
          timestamp: new Date().toISOString(),
          prompt: prompt,
          model: process.env.OPENAI_UI_MODEL || getDefaultModel('ui') // Updated to follow MODELS_MANIFEST.md
        }
      };
    } catch (error) {
      console.error('UI generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate UI component'
      };
    }
  }

  cleanupUICode(uiCode) {
    // Remove markdown code blocks if present
    let cleaned = uiCode.replace(/^```(jsx?|tsx?)\n?/gm, '').replace(/\n?```$/gm, '');
    
    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();
    
    return cleaned;
  }

  validateReactComponent(code) {
    // Basic validation for React component structure
    const hasImport = /import\s+React/i.test(code);
    const hasComponent = /function\s+\w+|const\s+\w+\s*=|class\s+\w+\s+extends/i.test(code);
    const hasJSX = /<\w+/i.test(code);
    const hasExport = /export\s+(default\s+)?/i.test(code);
    
    return hasComponent && hasJSX;
  }
}

module.exports = UIGenerator;