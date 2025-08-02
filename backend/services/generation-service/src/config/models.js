/**
 * Model Configuration
 * Based on specifications from specs/standards/MODELS_MANIFEST.md
 * 
 * This configuration defines available AI models and their recommended use cases
 * following the AetherOS model manifest standards.
 */

const MODEL_PROVIDERS = {
  OPENAI: 'openai',
  GOOGLE: 'google',
  ANTHROPIC: 'anthropic',
  GROQ: 'groq'
};

/**
 * OpenAI Models Configuration
 * Models are listed according to MODELS_MANIFEST.md with their characteristics
 */
const OPENAI_MODELS = {
  // GPT-4o Series - Flagship multimodal models
  'gpt-4o': {
    name: 'GPT-4o',
    provider: MODEL_PROVIDERS.OPENAI,
    description: 'Flagship multimodal model for advanced tool use, vision, and multimodal workflows',
    inputTokenLimit: 128000,
    outputTokenLimit: 16384,
    capabilities: ['text', 'audio', 'image', 'video'],
    outputs: ['text', 'audio', 'image'],
    useCases: ['complex reasoning', 'multimodal tasks', 'advanced tool use'],
    costTier: 'premium'
  },
  
  'gpt-4o-mini': {
    name: 'GPT-4o mini',
    provider: MODEL_PROVIDERS.OPENAI,
    description: 'Cost-efficient small multimodal model with strong performance on text and image tasks',
    inputTokenLimit: 128000,
    outputTokenLimit: 16384,
    capabilities: ['text', 'image'],
    outputs: ['text'],
    useCases: ['cost-efficient tasks', 'text processing', 'image analysis'],
    costTier: 'budget'
  },

  // GPT-4.1 Series - Latest generation
  'gpt-4.1': {
    name: 'GPT-4.1',
    provider: MODEL_PROVIDERS.OPENAI,
    description: 'Flagship GPT model for complex tasks with significant improvements in reasoning',
    inputTokenLimit: 1047576,
    outputTokenLimit: 32768,
    capabilities: ['text', 'image', 'audio', 'video'],
    outputs: ['text'],
    useCases: ['complex reasoning', 'large context', 'advanced analysis'],
    costTier: 'premium'
  },

  'gpt-4.1-mini': {
    name: 'GPT-4.1 mini',
    provider: MODEL_PROVIDERS.OPENAI,
    description: 'Balanced for intelligence, speed, and cost - cost-optimized version of GPT-4.1',
    inputTokenLimit: 1047576,
    outputTokenLimit: 32768,
    capabilities: ['text', 'image', 'audio'],
    outputs: ['text'],
    useCases: ['balanced performance', 'large context', 'cost optimization'],
    costTier: 'standard'
  },

  'gpt-4.1-nano': {
    name: 'GPT-4.1 nano',
    provider: MODEL_PROVIDERS.OPENAI,
    description: 'Fastest, most cost-effective GPT-4.1 model optimized for speed and efficiency',
    inputTokenLimit: 1000000,
    outputTokenLimit: 32768,
    capabilities: ['text', 'image'],
    outputs: ['text'],
    useCases: ['high-speed tasks', 'cost-effective processing', 'basic multimodal'],
    costTier: 'budget'
  },

  // o-Series - Reasoning models
  'o1': {
    name: 'o1',
    provider: MODEL_PROVIDERS.OPENAI,
    description: 'Advanced reasoning model with chain-of-thought capabilities',
    inputTokenLimit: 128000,
    outputTokenLimit: 32768,
    capabilities: ['text'],
    outputs: ['text'],
    useCases: ['complex reasoning', 'problem solving', 'strategy', 'coding'],
    costTier: 'premium'
  },

  'o1-mini': {
    name: 'o1-mini',
    provider: MODEL_PROVIDERS.OPENAI,
    description: 'Cost-efficient reasoning model with structured outputs support',
    inputTokenLimit: 128000,
    outputTokenLimit: 65536,
    capabilities: ['text'],
    outputs: ['text'],
    useCases: ['STEM tasks', 'structured reasoning', 'cost-efficient analysis'],
    costTier: 'standard'
  }
};

/**
 * Default model selection based on task type
 * Following MODELS_MANIFEST.md recommendations for optimal cost/performance balance
 */
const DEFAULT_MODELS = {
  // General purpose - balance of capability and cost
  general: 'gpt-4o-mini',
  
  // Code generation - structured output, good performance
  code: 'gpt-4o-mini',
  
  // API design - complex reasoning needed
  api: 'gpt-4o',
  
  // UI generation - multimodal capabilities helpful
  ui: 'gpt-4o',
  
  // CLI generation - structured output, cost-efficient
  cli: 'gpt-4o-mini',
  
  // Complex reasoning tasks
  reasoning: 'o1-mini',
  
  // High-speed, cost-sensitive tasks
  fast: 'gpt-4.1-nano',
  
  // Large context tasks
  largeContext: 'gpt-4.1-mini'
};

/**
 * Get model configuration by name
 */
function getModelConfig(modelName) {
  return OPENAI_MODELS[modelName] || null;
}

/**
 * Get default model for a specific task type
 */
function getDefaultModel(taskType = 'general') {
  return DEFAULT_MODELS[taskType] || DEFAULT_MODELS.general;
}

/**
 * Get available models by use case
 */
function getModelsByUseCase(useCase) {
  return Object.entries(OPENAI_MODELS)
    .filter(([_, config]) => config.useCases.includes(useCase))
    .map(([name]) => name);
}

/**
 * Get models by cost tier
 */
function getModelsByCostTier(costTier) {
  return Object.entries(OPENAI_MODELS)
    .filter(([_, config]) => config.costTier === costTier)
    .map(([name]) => name);
}

/**
 * Validate if a model name is supported
 */
function isValidModel(modelName) {
  return modelName in OPENAI_MODELS;
}

module.exports = {
  MODEL_PROVIDERS,
  OPENAI_MODELS,
  DEFAULT_MODELS,
  getModelConfig,
  getDefaultModel,
  getModelsByUseCase,
  getModelsByCostTier,
  isValidModel
};