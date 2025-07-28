const LLMClient = require('../llm/client');

class CodeGenerator {
  constructor() {
    this.llmClient = new LLMClient();
  }

  async generate(prompt, options = {}) {
    try {
      const generatedCode = await this.llmClient.generateCode(prompt, options.language);
      
      // Detect language if not specified
      const language = options.language || this.detectLanguage(generatedCode);
      
      // Clean up the generated code
      const cleanCode = this.cleanupCode(generatedCode);
      
      return {
        success: true,
        code: cleanCode,
        language: language,
        metadata: {
          timestamp: new Date().toISOString(),
          prompt: prompt,
          model: 'gpt-3.5-turbo'
        }
      };
    } catch (error) {
      console.error('Code generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate code'
      };
    }
  }

  detectLanguage(code) {
    // Simple language detection based on common patterns
    const patterns = {
      python: [/def\s+\w+\(/i, /import\s+\w+/i, /from\s+\w+\s+import/i, /if\s+__name__\s*==\s*['""]__main__['""]:/i],
      javascript: [/function\s+\w+\(/i, /const\s+\w+\s*=/i, /let\s+\w+\s*=/i, /require\(['"]/i, /module\.exports/i],
      typescript: [/interface\s+\w+/i, /type\s+\w+\s*=/i, /import.*from\s+['"]/i, /export\s+(default\s+)?/i],
      java: [/public\s+class\s+\w+/i, /import\s+java\./i, /public\s+static\s+void\s+main/i],
      csharp: [/using\s+System/i, /public\s+class\s+\w+/i, /namespace\s+\w+/i],
      go: [/package\s+\w+/i, /import\s+[\("]/i, /func\s+\w+\(/i],
      rust: [/fn\s+\w+\(/i, /use\s+std::/i, /let\s+mut\s+\w+/i],
      php: [/<\?php/i, /function\s+\w+\(/i, /\$\w+\s*=/i],
      ruby: [/def\s+\w+/i, /require\s+['"]/i, /class\s+\w+/i],
      bash: [/^#!\/bin\/bash/i, /^#!\/bin\/sh/i, /\$\{.*\}/i, /if\s*\[.*\]/i],
      sql: [/SELECT\s+.*FROM/i, /INSERT\s+INTO/i, /UPDATE\s+.*SET/i, /CREATE\s+TABLE/i],
      html: [/<html/i, /<head/i, /<body/i, /<div/i],
      css: [/\{[^}]*\}/i, /\.[a-zA-Z][\w-]*\s*\{/i, /#[a-zA-Z][\w-]*\s*\{/i],
      yaml: [/---/i, /\w+:\s*$/m, /\s+-\s+\w+/i],
      json: [/\{.*".*".*:.*\}/i, /\[.*\{.*\}.*\]/i]
    };

    for (const [language, regexes] of Object.entries(patterns)) {
      if (regexes.some(regex => regex.test(code))) {
        return language;
      }
    }

    return 'text';
  }

  cleanupCode(code) {
    // Remove markdown code blocks if present
    let cleaned = code.replace(/^```\w*\n?/gm, '').replace(/\n?```$/gm, '');
    
    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();
    
    // Normalize line endings
    cleaned = cleaned.replace(/\r\n/g, '\n');
    
    return cleaned;
  }

  validateCode(code, language) {
    // Basic validation based on language
    const validations = {
      python: {
        minLength: 10,
        requiredPatterns: [/def\s+\w+|class\s+\w+|import\s+\w+/i]
      },
      javascript: {
        minLength: 10,
        requiredPatterns: [/function|const|let|var/i]
      },
      // Add more validations as needed
    };

    const validation = validations[language];
    if (!validation) return true; // No validation rules for this language

    if (code.length < validation.minLength) {
      return false;
    }

    if (validation.requiredPatterns && !validation.requiredPatterns.some(pattern => pattern.test(code))) {
      return false;
    }

    return true;
  }
}

module.exports = CodeGenerator;