# Model Configuration and Usage

This document explains how AetherOS follows the specifications in `MODELS_MANIFEST.md` for AI model usage.

## Overview

AetherOS has been updated to strictly follow the model specifications defined in `specs/standards/MODELS_MANIFEST.md`. The system now uses current, recommended AI models with optimized configurations for different use cases.

## Model Selection Strategy

### Default Models (Following MODELS_MANIFEST.md)

- **General Tasks**: `gpt-4o-mini` - Cost-efficient multimodal model
- **Code Generation**: `gpt-4o-mini` - Good balance of capability and cost
- **API Design**: `gpt-4o` - Complex reasoning and multimodal capabilities
- **UI Generation**: `gpt-4o` - Multimodal capabilities for visual tasks
- **CLI Generation**: `gpt-4o-mini` - Structured output, cost-efficient
- **Complex Reasoning**: `o1-mini` - Specialized reasoning model
- **High-Speed Tasks**: `gpt-4.1-nano` - Fastest, most cost-effective
- **Large Context**: `gpt-4.1-mini` - Extended context window

## Configuration

### Environment Variables

The following environment variables control model selection:

```bash
# Default model for general completions
OPENAI_DEFAULT_MODEL=gpt-4o-mini

# Specialized models for different tasks
OPENAI_CODE_MODEL=gpt-4o-mini      # Code generation
OPENAI_API_MODEL=gpt-4o            # API design
OPENAI_UI_MODEL=gpt-4o             # UI generation
OPENAI_CLI_MODEL=gpt-4o-mini       # CLI generation
```

### Model Configuration File

The system includes a comprehensive model configuration at `src/config/models.js` that:

- Defines all supported models from MODELS_MANIFEST.md
- Includes model capabilities, token limits, and use cases
- Provides helper functions for model selection
- Validates model names against the manifest

## Implementation Details

### Updated Components

1. **LLM Client** (`src/llm/client.js`)
   - Updated to use models from MODELS_MANIFEST.md
   - Added model validation
   - Improved logging and error handling

2. **Generator Services**
   - Code Generator: Uses `gpt-4o-mini` for cost-efficient code generation
   - API Generator: Uses `gpt-4o` for complex API design tasks
   - UI Generator: Uses `gpt-4o` for multimodal UI generation
   - CLI Generator: Uses `gpt-4o-mini` for structured CLI output

3. **Configuration**
   - Added comprehensive model definitions
   - Environment variable support for model selection
   - Model validation and fallback mechanisms

### Benefits

- **Cost Optimization**: Uses most cost-effective models for each task type
- **Performance**: Leverages appropriate model capabilities per use case
- **Compliance**: Strictly follows MODELS_MANIFEST.md specifications
- **Flexibility**: Easy to update models by changing environment variables
- **Validation**: Prevents usage of deprecated or unsupported models

## Model Capabilities Reference

Based on MODELS_MANIFEST.md specifications:

### GPT-4o Series
- **gpt-4o**: Flagship multimodal (text, audio, image, video) → text, audio, image
- **gpt-4o-mini**: Cost-efficient multimodal (text, image) → text

### GPT-4.1 Series  
- **gpt-4.1**: Enhanced reasoning with large context (1M+ tokens)
- **gpt-4.1-mini**: Balanced performance with large context
- **gpt-4.1-nano**: Fastest, most cost-effective option

### Reasoning Models
- **o1**: Advanced reasoning with chain-of-thought capabilities
- **o1-mini**: Cost-efficient reasoning with structured outputs

## Migration Notes

- **Removed**: All references to deprecated `gpt-3.5-turbo`
- **Added**: Support for current OpenAI model lineup
- **Updated**: Default model selections for optimal cost/performance balance
- **Enhanced**: Model validation and configuration management

This ensures AetherOS stays current with the latest AI model capabilities while maintaining cost efficiency and performance optimization.