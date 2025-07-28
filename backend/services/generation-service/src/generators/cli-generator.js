const LLMClient = require('../llm/client');

class CLIGenerator {
  constructor() {
    this.llmClient = new LLMClient();
  }

  async generate(prompt, options = {}, logger = null) {
    try {
      const generatedCLI = await this.llmClient.generateCLI(prompt, logger);
      
      // Clean up the generated CLI code
      const cleanedCLI = this.cleanupCLICode(generatedCLI);
      
      // Detect the language/platform
      const language = this.detectCLILanguage(cleanedCLI);
      
      return {
        success: true,
        cli: cleanedCLI,
        success: true,
        code: cleanedCLI,
        language: language,
        executable: this.isExecutable(cleanedCLI),
        metadata: {
          timestamp: new Date().toISOString(),
          prompt: prompt,
          model: 'gpt-3.5-turbo'
        }
      };
    } catch (error) {
      console.error('CLI generation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate CLI tool'
      };
    }
  }

  cleanupCLICode(cliCode) {
    // Remove markdown code blocks if present
    let cleaned = cliCode.replace(/^```\w*\n?/gm, '').replace(/\n?```$/gm, '');
    
    // Remove leading/trailing whitespace
    cleaned = cleaned.trim();
    
    return cleaned;
  }

  detectCLILanguage(code) {
    if (/^#!\/bin\/bash|^#!\/bin\/sh/i.test(code)) return 'bash';
    if (/^#!\/usr\/bin\/env python|import\s+argparse/i.test(code)) return 'python';
    if (/^#!\/usr\/bin\/env node|require.*commander|process\.argv/i.test(code)) return 'javascript';
    if (/package\s+main|import\s+"flag"/i.test(code)) return 'go';
    if (/use\s+clap::|fn\s+main\(\)/i.test(code)) return 'rust';
    
    return 'unknown';
  }

  isExecutable(code) {
    // Check if the code contains shebang or main function patterns
    const patterns = [
      /^#!/, // Shebang
      /if\s+__name__\s*==\s*['""]__main__['""]:/i, // Python main
      /fn\s+main\(\)/i, // Rust/Go main
      /public\s+static\s+void\s+main/i, // Java main
      /def\s+main\(/i // Python main function
    ];
    
    return patterns.some(pattern => pattern.test(code));
  }

  generateInstallInstructions(language) {
    const instructions = {
      python: 'Save as .py file and run with: python script.py',
      javascript: 'Save as .js file and run with: node script.js',
      bash: 'Save as .sh file, make executable with chmod +x script.sh, then run with: ./script.sh',
      go: 'Save as .go file and run with: go run script.go',
      rust: 'Create a new Rust project and replace main.rs with this code'
    };
    
    return instructions[language] || 'Save the code and run according to the language requirements';
  }
}

module.exports = CLIGenerator;