# Complete AI Models & API Documentation

## Table of Contents

- [OpenAI Models](#openai-models)
- [Google AI Models](#google-ai-models)
- [Anthropic Claude Models](#anthropic-claude-models)
- [xAI Grok Models](#xai-grok-models)
- [Groq Models](#groq-models)
- [Perplexity AI Models](#perplexity-ai-models)
- [Moonshot AI Models](#moonshot-ai-models)
- [Qwen Models](#qwen-models)

---

## OpenAI Models

### GPT-4o
- **Model Code**: `gpt-4o`
- **Last Updated**: October 2024
- **Description**: OpenAI's flagship multimodal model that accepts text, audio, image, and video inputs, and can output text, audio, and images. Best choice for advanced tool use, vision, and multimodal workflows.
- **Status**: Active
- **Inputs**: text, audio, image, video
- **Outputs**: text, audio, image
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Multimodal capabilities, Advanced tool use, Vision processing, Real-time audio processing, Function calling, Structured outputs
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o

### GPT-4o mini
- **Model Code**: `gpt-4o-mini`
- **Last Updated**: October 2024
- **Description**: Cost-efficient small multimodal model with strong performance on text and image tasks. Video and audio capabilities coming soon.
- **Status**: Active
- **Inputs**: text, image
- **Outputs**: text
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Cost-efficient, Text and image processing, Video and audio capabilities coming soon, MMLU: 82.0%, MGSM: 87.0%, HumanEval: 87.2%, MMMU: 59.4%, Function calling, Structured outputs
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o-mini

### GPT-4.1
- **Model Code**: `gpt-4.1`
- **Last Updated**: April 14, 2025
- **Description**: Flagship GPT model for complex tasks with significant improvements in reasoning and multimodal capabilities.
- **Status**: Active
- **Inputs**: text, image, audio, video
- **Outputs**: text
- **Input Token Limit**: 1,047,576 tokens
- **Output Token Limit**: 32,768 tokens
- **Key Features**: Enhanced reasoning, Large context window, Advanced multimodal processing, Superior problem solving, Complex task handling
- **Model Card**: https://platform.openai.com/docs/models/gpt-4.1

### GPT-4.1 mini
- **Model Code**: `gpt-4.1-mini`
- **Last Updated**: April 14, 2025
- **Description**: Balanced for intelligence, speed, and cost - the cost-optimized version of GPT-4.1.
- **Status**: Active
- **Inputs**: text, image, audio
- **Outputs**: text
- **Input Token Limit**: 1,047,576 tokens
- **Output Token Limit**: 32,768 tokens
- **Key Features**: Cost-efficient, Fast processing, Balanced performance, Large context window, Multimodal capabilities
- **Model Card**: https://platform.openai.com/docs/models/gpt-4.1-mini

### GPT-4.1 nano
- **Model Code**: `gpt-4.1-nano`
- **Last Updated**: April 14, 2025
- **Description**: Fastest, most cost-effective GPT-4.1 model optimized for speed and efficiency.
- **Status**: Active
- **Inputs**: text, image
- **Outputs**: text
- **Input Token Limit**: 1,000,000 tokens
- **Output Token Limit**: 32,768 tokens
- **Key Features**: Ultra-fast processing, Most cost-effective, Large context window, Basic multimodal, High-speed inference
- **Model Card**: https://platform.openai.com/docs/models/gpt-4.1-nano

### ChatGPT-4o
- **Model Code**: `chatgpt-4o-latest`
- **Last Updated**: 2024
- **Description**: GPT-4o model used in ChatGPT with optimizations for conversational interactions.
- **Status**: Active
- **Inputs**: text, image
- **Outputs**: text
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Conversational optimization, ChatGPT integration, Multimodal capabilities, Real-time processing
- **Model Card**: https://platform.openai.com/docs/models/chatgpt-4o-latest

### o1
- **Model Code**: `o1`
- **Last Updated**: October 2024
- **Description**: Advanced reasoning model with chain-of-thought capabilities, designed for complex problem-solving, strategy, coding, and analytical tasks.
- **Status**: Active
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 32,768 tokens
- **Key Features**: Chain-of-thought reasoning, Complex problem solving, Strategy ideation, Advanced coding capabilities, Mathematical reasoning, No image input support
- **Model Card**: https://platform.openai.com/docs/models/o1

### o1-preview
- **Model Code**: `o1-preview`
- **Last Updated**: October 2024
- **Description**: Limited-access early release of the o1 reasoning model, reserved for original preview access holders.
- **Status**: Preview
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 32,768 tokens
- **Key Features**: Single reasoning mode, Limited access, Advanced reasoning capabilities, No developer messages support, No structured outputs
- **Model Card**: https://platform.openai.com/docs/models/o1-preview

### o1-mini
- **Model Code**: `o1-mini`
- **Last Updated**: October 2024
- **Description**: Cost-efficient reasoning model that matches or exceeds o1-preview on STEM benchmarks while being significantly cheaper and faster.
- **Status**: Active
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 65,536 tokens
- **Key Features**: Three reasoning-effort settings (low, medium, high), Structured outputs support, Developer messages support, Streaming support, 80% lower cost than o1-preview, Faster processing, Strong STEM performance
- **Model Card**: https://platform.openai.com/docs/models/o1-mini

### o3-mini
- **Model Code**: `o3-mini`
- **Last Updated**: January 31, 2025
- **Description**: A small model alternative to o3 (Deprecated).
- **Status**: Deprecated
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 100,000 tokens
- **Key Features**: Three reasoning-effort options, Structured outputs support, Developer messages support, Streaming support, Function calling, STEM optimization, 39% fewer major errors vs o1-mini, 24% lower latency
- **Model Card**: https://platform.openai.com/docs/models/o3-mini

### o3
- **Model Code**: `o3`
- **Last Updated**: April 16, 2025
- **Description**: Our most powerful reasoning model with advanced chain-of-thought capabilities for complex problem-solving.
- **Status**: Active
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 100,000 tokens
- **Key Features**: Advanced reasoning capabilities, Complex problem solving, Chain-of-thought processing, Mathematical reasoning, Strategy ideation, Code generation
- **Model Card**: https://platform.openai.com/docs/models/o3

### o3-pro
- **Model Code**: `o3-pro`
- **Last Updated**: June 10, 2025
- **Description**: Version of o3 with more compute for better responses and enhanced reasoning capabilities.
- **Status**: Active
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 100,000 tokens
- **Key Features**: Enhanced compute resources, Superior reasoning performance, Advanced problem solving, Complex analytical tasks, Extended processing time
- **Model Card**: https://platform.openai.com/docs/models/o3-pro

### o4-mini
- **Model Code**: `o4-mini`
- **Last Updated**: April 16, 2025
- **Description**: Faster, more affordable reasoning model optimized for cost-efficiency while maintaining strong reasoning capabilities.
- **Status**: Active
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 100,000 tokens
- **Key Features**: Cost-efficient reasoning, Fast processing, Strong STEM performance, Structured outputs, Function calling, Developer messages support
- **Model Card**: https://platform.openai.com/docs/models/o4-mini

### o3-deep-research
- **Model Code**: `o3-deep-research`
- **Last Updated**: 2025
- **Description**: Our most powerful deep research model designed for complex research and analytical tasks.
- **Status**: Active
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 100,000 tokens
- **Key Features**: Deep research capabilities, Complex analysis, Extended reasoning, Research optimization, Academic writing, Literature analysis
- **Model Card**: https://platform.openai.com/docs/models/o3-deep-research

### o4-mini-deep-research
- **Model Code**: `o4-mini-deep-research`
- **Last Updated**: 2025
- **Description**: Faster, more affordable deep research model optimized for cost-efficient research tasks.
- **Status**: Active
- **Inputs**: text
- **Outputs**: text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 100,000 tokens
- **Key Features**: Cost-efficient research, Fast processing, Academic analysis, Research assistance, Literature review, Data analysis
- **Model Card**: https://platform.openai.com/docs/models/o4-mini-deep-research

### DALL·E 3
- **Model Code**: `dall-e-3`
- **Last Updated**: Current
- **Description**: Advanced image generation model that creates entirely new images from text prompts with built-in safety moderation.
- **Status**: Active
- **Inputs**: text prompts
- **Outputs**: images
- **Key Features**: Text-to-image generation, Built-in moderation filters, Multiple output formats (PNG, JPG), Multiple resolutions (256×256, 512×512, 1024×1024), Automatic prompt rewriting for safety and detail, No edit or variation endpoints
- **Model Card**: https://platform.openai.com/docs/models/dall-e-3

### GPT Image 1
- **Model Code**: `gpt-image-1`
- **Last Updated**: 2025
- **Description**: State-of-the-art image generation model with enhanced quality and creative control.
- **Status**: Active
- **Inputs**: text prompts
- **Outputs**: images
- **Key Features**: High-quality image generation, Advanced creative control, Multiple styles, Enhanced safety features, Professional-grade outputs
- **Model Card**: https://platform.openai.com/docs/models/gpt-image-1

### Whisper
- **Model Code**: `whisper-1`
- **Last Updated**: 2023
- **Description**: General-purpose speech recognition model supporting 50+ languages and dialects with improved accuracy for low-quality audio and accents.
- **Status**: Active
- **Inputs**: audio files
- **Outputs**: transcribed text
- **Key Features**: 50+ languages and dialects support, Improved low-quality audio handling, Overlapping speech recognition, Accent handling, Language identification, Timestamped word-level alignments
- **Model Card**: https://platform.openai.com/docs/models/whisper-1

### GPT-4o Transcribe
- **Model Code**: `gpt-4o-transcribe`
- **Last Updated**: 2024
- **Description**: Speech-to-text model powered by GPT-4o with enhanced transcription capabilities.
- **Status**: Active
- **Inputs**: audio files
- **Outputs**: transcribed text
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: GPT-4o powered transcription, Enhanced accuracy, Contextual understanding, Multiple languages, Advanced audio processing
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o-transcribe

### GPT-4o mini Transcribe
- **Model Code**: `gpt-4o-mini-transcribe`
- **Last Updated**: 2024
- **Description**: Speech-to-text model powered by GPT-4o mini offering cost-efficient transcription.
- **Status**: Active
- **Inputs**: audio files
- **Outputs**: transcribed text
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Cost-efficient transcription, Fast processing, Good accuracy, Multiple languages, GPT-4o mini powered
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o-mini-transcribe

### TTS (Text-to-Speech) Speed
- **Model Code**: `tts-1`
- **Last Updated**: 2023
- **Description**: Speed-optimized text-to-speech model designed for real-time applications with sub-200ms startup in streaming mode.
- **Status**: Active
- **Inputs**: text
- **Outputs**: audio
- **Key Features**: Six preset voices (Alloy, Echo, Fable, Onyx, Nova, Shimmer), Multiple output formats (MP3, Opus, AAC, FLAC), Real-time streaming support, Sub-200ms startup latency, Optimized for speed
- **Model Card**: https://platform.openai.com/docs/models/tts-1

### TTS (Text-to-Speech) HD
- **Model Code**: `tts-1-hd`
- **Last Updated**: 2023
- **Description**: Quality-optimized text-to-speech model designed for naturalness with higher audio quality than the speed-optimized variant.
- **Status**: Active
- **Inputs**: text
- **Outputs**: audio
- **Key Features**: Six preset voices (Alloy, Echo, Fable, Onyx, Nova, Shimmer), Multiple output formats (MP3, Opus, AAC, FLAC), Real-time streaming support, ~500ms startup latency, Optimized for quality and naturalness
- **Model Card**: https://platform.openai.com/docs/models/tts-1-hd

### GPT-4o mini TTS
- **Model Code**: `gpt-4o-mini-tts`
- **Last Updated**: 2024
- **Description**: Text-to-speech model powered by GPT-4o mini with enhanced voice quality and contextual understanding.
- **Status**: Active
- **Inputs**: text
- **Outputs**: audio
- **Key Features**: GPT-4o mini powered, Enhanced voice quality, Contextual understanding, Multiple voices, Real-time streaming
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o-mini-tts

### GPT-4o Realtime
- **Model Code**: `gpt-4o-realtime-preview`
- **Last Updated**: 2024
- **Description**: Model capable of realtime text and audio inputs and outputs for interactive conversations.
- **Status**: Preview
- **Inputs**: text, audio (realtime)
- **Outputs**: text, audio (realtime)
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Real-time audio processing, Interactive conversations, Low latency, Voice interaction, Streaming audio
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o-realtime-preview

### GPT-4o mini Realtime
- **Model Code**: `gpt-4o-mini-realtime-preview`
- **Last Updated**: December 17, 2024
- **Description**: Smaller realtime model for text and audio inputs and outputs with cost-efficient real-time interaction.
- **Status**: Preview
- **Inputs**: text, audio (realtime)
- **Outputs**: text, audio (realtime)
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Cost-efficient realtime, Fast processing, Real-time audio, Interactive conversations, Low latency
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o-mini-realtime-preview

### Text Embedding 3 Small
- **Model Code**: `text-embedding-3-small`
- **Last Updated**: 2024
- **Description**: Cost-efficient embedding model that maps text into numerical vectors for semantic search, clustering, and RAG applications.
- **Status**: Active
- **Inputs**: text
- **Outputs**: embeddings
- **Input Token Limit**: 8,191 tokens
- **Output**: 1,536 dimensions
- **Key Features**: 1,536 dimensions, 5× cheaper than ada-002, Improved multilingual performance
- **Model Card**: https://platform.openai.com/docs/models/text-embedding-3-small

### Text Embedding 3 Large
- **Model Code**: `text-embedding-3-large`
- **Last Updated**: 2024
- **Description**: Most capable embedding model for high-quality vector representations and semantic understanding.
- **Status**: Active
- **Inputs**: text
- **Outputs**: embeddings
- **Input Token Limit**: 8,191 tokens
- **Output**: 3,072 dimensions
- **Key Features**: 3,072 dimensions, Superior quality, Enhanced semantic understanding, Best performance
- **Model Card**: https://platform.openai.com/docs/models/text-embedding-3-large

### Text Embedding Ada 002
- **Model Code**: `text-embedding-ada-002`
- **Last Updated**: 2022
- **Description**: Older embedding model for text-to-vector conversion, now superseded by newer models.
- **Status**: Legacy
- **Inputs**: text
- **Outputs**: embeddings
- **Input Token Limit**: 8,191 tokens
- **Output**: 1,536 dimensions
- **Key Features**: Legacy model, Basic embedding functionality, Cost-effective for simple use cases
- **Model Card**: https://platform.openai.com/docs/models/text-embedding-ada-002

### GPT-4o Search Preview
- **Model Code**: `gpt-4o-search-preview`
- **Last Updated**: 2024
- **Description**: GPT model for web search in Chat Completions with enhanced search capabilities.
- **Status**: Preview
- **Inputs**: text, search queries
- **Outputs**: text with search results
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Web search integration, Real-time information, Search optimization, Chat completions, Preview features
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o-search-preview

### GPT-4o mini Search Preview
- **Model Code**: `gpt-4o-mini-search-preview`
- **Last Updated**: 2024
- **Description**: Fast, affordable small model for web search with cost-efficient search capabilities.
- **Status**: Preview
- **Inputs**: text, search queries
- **Outputs**: text with search results
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Cost-efficient search, Fast processing, Web search integration, Affordable search operations
- **Model Card**: https://platform.openai.com/docs/models/gpt-4o-mini-search-preview

### Computer Use Preview
- **Model Code**: `computer-use-preview`
- **Last Updated**: 2024
- **Description**: Specialized model for computer use tool with enhanced capabilities for system interaction.
- **Status**: Preview
- **Inputs**: text, system commands
- **Outputs**: text, system actions
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 16,384 tokens
- **Key Features**: Computer interaction, System automation, Tool use capabilities, Preview features, Enhanced control
- **Model Card**: https://platform.openai.com/docs/models/computer-use-preview

### Codex Mini Latest
- **Model Code**: `codex-mini-latest`
- **Last Updated**: 2025
- **Description**: Fast reasoning model optimized for the Codex CLI with enhanced code understanding.
- **Status**: Active
- **Inputs**: text, code
- **Outputs**: text, code
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 100,000 tokens
- **Key Features**: Code optimization, CLI integration, Fast reasoning, Code understanding, Development assistance
- **Model Card**: https://platform.openai.com/docs/models/codex-mini-latest

### Omni Moderation
- **Model Code**: `omni-moderation-latest`
- **Last Updated**: 2024
- **Description**: Identify potentially harmful content in text and images with comprehensive moderation capabilities.
- **Status**: Active
- **Inputs**: text, images
- **Outputs**: classification scores
- **Key Features**: Text and image moderation, Comprehensive safety, Content classification, Harm detection, Multi-modal moderation
- **Model Card**: https://platform.openai.com/docs/models/omni-moderation-latest

### Text Moderation
- **Model Code**: `text-moderation-latest`
- **Last Updated**: 2023
- **Description**: Previous generation text-only moderation model for content safety classification.
- **Status**: Deprecated
- **Inputs**: text
- **Outputs**: classification scores
- **Key Features**: Text-only moderation, Content classification, Safety detection, Legacy model
- **Model Card**: https://platform.openai.com/docs/models/text-moderation-latest

---

## Google AI Models

### Gemini 2.5 Pro
- **Model Code**: `gemini-2.5-pro`
- **Last Updated**: June 2025
- **Description**: State-of-the-art model for complex reasoning in code, math, STEM, and analysis of large datasets.
- **Inputs**: Audio, images, video, text, PDF
- **Outputs**: Text
- **Input Token Limit**: 1,048,576 tokens
- **Output Token Limit**: 65,536 tokens
- **Key Features**: Structured outputs, Caching, Function calling, Code execution, Search grounding, Image/Audio generation, Live API, Thinking
- **Model Card**: https://ai.google.dev/models/gemini-2.5-pro

### Gemini 2.5 Flash
- **Model Code**: `models/gemini-2.5-flash`
- **Last Updated**: June 2025
- **Description**: Best price-performance model for large-scale, low-latency, high-volume tasks.
- **Inputs**: Text, images, video, audio
- **Outputs**: Text
- **Input Token Limit**: 1,048,576 tokens
- **Output Token Limit**: 65,536 tokens
- **Key Features**: Audio generation, Caching, Code execution, Function calling, Image generation, Search grounding, Structured outputs, Batch Mode
- **Model Card**: https://ai.google.dev/models/gemini-2.5-flash

### Gemini 2.5 Flash-Lite
- **Model Code**: `models/gemini-2.5-flash-lite`
- **Last Updated**: July 2025
- **Description**: Cost-efficient and high-throughput version of Gemini 2.5 Flash.
- **Inputs**: Text, image, video, audio, PDF
- **Outputs**: Text
- **Input Token Limit**: 1,048,576 tokens
- **Output Token Limit**: 65,536 tokens
- **Key Features**: Structured outputs, Caching, Function calling, Code execution, URL Context, Search grounding, Image/Audio generation, Live API
- **Model Card**: https://ai.google.dev/models/gemini-2.5-flash-lite

### Gemini 2.5 Flash Native Audio
- **Model Code**: `models/gemini-2.5-flash-preview-native-audio-dialog`
- **Last Updated**: May 2025
- **Description**: Native audio dialog model for interactive and unstructured conversational experiences.
- **Inputs**: Audio, video, text
- **Outputs**: Audio, text
- **Input Token Limit**: 128,000 tokens
- **Output Token Limit**: 8,000 tokens
- **Key Features**: Audio generation, Caching, Code execution, Function calling, Image generation, Search grounding, Structured outputs, Tuning
- **Model Card**: https://ai.google.dev/models/gemini-2.5-flash-native-audio

### Gemini 2.5 Flash Preview TTS
- **Model Code**: `models/gemini-2.5-flash-preview-tts`
- **Last Updated**: May 2025
- **Description**: Price-performant text-to-speech model for podcasts and audiobooks.
- **Inputs**: Text
- **Outputs**: Audio
- **Input Token Limit**: 8,000 tokens
- **Output Token Limit**: 16,000 tokens
- **Key Features**: Structured outputs, Caching, Tuning, Function calling, Code execution, Search, Audio gen, Live API, Thinking
- **Model Card**: https://ai.google.dev/models/gemini-2.5-flash-preview-tts

### Gemini 2.5 Pro Preview TTS
- **Model Code**: `models/gemini-2.5-pro-preview-tts`
- **Last Updated**: May 2025
- **Description**: Most powerful text-to-speech model for high-control structured audio gen.
- **Inputs**: Text
- **Outputs**: Audio
- **Input Token Limit**: 8,000 tokens
- **Output Token Limit**: 16,000 tokens
- **Key Features**: Structured outputs, Caching, Tuning, Function calling, Code execution, Search, Audio gen, Live API, Thinking
- **Model Card**: https://ai.google.dev/models/gemini-2.5-pro-preview-tts

### Gemini 2.0 Flash
- **Model Code**: `models/gemini-2.0-flash`
- **Last Updated**: Feb 2025
- **Description**: Next-gen features with superior speed, native tool use, and a 1M token context window.
- **Inputs**: Audio, images, video, text
- **Outputs**: Text
- **Input Token Limit**: 1,048,576 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Structured outputs, Caching, Tuning, Function calling, Code execution, Search, Image/Audio gen, Live API
- **Model Card**: https://ai.google.dev/models/gemini-2.0-flash

### Gemini 2.0 Flash Preview Image Generation
- **Model Code**: `models/gemini-2.0-flash-preview-image-generation`
- **Last Updated**: May 2025
- **Description**: Improved image generation and conversational image editing.
- **Inputs**: Audio, images, video, text
- **Outputs**: Text, images
- **Input Token Limit**: 32,000 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Structured outputs, Caching, Tuning, Function calling, Code execution, Search, Image/Audio gen, Live API
- **Model Card**: https://ai.google.dev/models/gemini-2.0-flash-preview-image-gen

### Gemini 2.0 Flash-Lite
- **Model Code**: `models/gemini-2.0-flash-lite`
- **Last Updated**: Feb 2025
- **Description**: Cost-efficient and low-latency version of Gemini 2.0 Flash.
- **Inputs**: Audio, images, video, text
- **Outputs**: Text
- **Input Token Limit**: 1,048,576 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Structured outputs, Caching, Tuning, Function calling, Code execution, Search, Image/Audio gen, Live API
- **Model Card**: https://ai.google.dev/models/gemini-2.0-flash-lite

### Imagen 4
- **Model Code**: `imagen-4.0-generate-preview-06-06`
- **Last Updated**: June 2025
- **Description**: Latest image model for highly detailed images, rich lighting, better text rendering.
- **Inputs**: Text
- **Outputs**: Images
- **Input Token Limit**: 480 tokens
- **Output Token Limit**: N/A
- **Key Features**: High-resolution output
- **Model Card**: https://ai.google.dev/models/imagen-4

### Imagen 3
- **Model Code**: `imagen-3.0-generate-002`
- **Last Updated**: Feb 2025
- **Description**: High-quality text-to-image model for detailed images, rich lighting.
- **Inputs**: Text
- **Outputs**: Images
- **Input Token Limit**: N/A
- **Output Token Limit**: N/A
- **Key Features**: Fewer distracting artifacts
- **Model Card**: https://ai.google.dev/models/imagen-3

### Veo 3 Preview
- **Model Code**: `veo-3.0-generate-preview`
- **Last Updated**: July 2025
- **Description**: Latest text-to-video model with integrated audio and direct camera controls.
- **Inputs**: Text
- **Outputs**: Video w/ audio
- **Input Token Limit**: 1,024 tokens
- **Output Token Limit**: N/A
- **Key Features**: Enhanced prompt adherence
- **Model Card**: https://ai.google.dev/models/veo-3-preview

### Veo 2
- **Model Code**: `veo-2.0-generate-001`
- **Last Updated**: April 2025
- **Description**: High-quality text- and image-to-video model for detailed videos.
- **Inputs**: Text, image
- **Outputs**: Video
- **Input Token Limit**: N/A
- **Output Token Limit**: N/A
- **Key Features**: Captures artistic nuance
- **Model Card**: https://ai.google.dev/models/veo-2

### Gemini 2.5 Flash Live
- **Model Code**: `models/gemini-live-2.5-flash-preview`
- **Last Updated**: June 2025
- **Description**: Enables low-latency bidirectional voice/video interactions with Gemini.
- **Inputs**: Audio, video, text
- **Outputs**: Text, audio
- **Input Token Limit**: 1,048,576 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Structured outputs, Tuning, Function calling, Code execution, Search, Image/Audio gen, Thinking
- **Model Card**: https://ai.google.dev/models/gemini-2.5-flash-live

### Gemini 2.0 Flash Live
- **Model Code**: `models/gemini-2.0-flash-live-001`
- **Last Updated**: April 2025
- **Description**: Enables low-latency bidirectional voice/video interactions with Gemini.
- **Inputs**: Audio, video, text
- **Outputs**: Text, audio
- **Input Token Limit**: 1,048,576 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Structured outputs, Tuning, Function calling, Code execution, Search, Image/Audio gen, Thinking
- **Model Card**: https://ai.google.dev/models/gemini-2.0-flash-live

### Gemini Embedding
- **Model Code**: `gemini-embedding-001`
- **Last Updated**: June 2025
- **Description**: Measures relatedness of strings for applications like retrieval.
- **Inputs**: Text
- **Outputs**: Text embeddings
- **Input Token Limit**: 2,048 tokens
- **Output Token Limit**: N/A
- **Key Features**: Code, multi-lingual support
- **Model Card**: https://ai.google.dev/models/gemini-embedding

### Text Embedding (Legacy)
- **Model Code**: `models/text-embedding-004`
- **Last Updated**: April 2024
- **Description**: Legacy model for measuring relatedness of text strings.
- **Inputs**: Text
- **Outputs**: Text embeddings
- **Input Token Limit**: 2,048 tokens
- **Output Token Limit**: N/A
- **Key Features**: Adjustable safety settings
- **Model Card**: https://ai.google.dev/models/text-embedding

---

## Anthropic Claude Models

### Claude Opus 4
- **Model Code**: `claude-opus-4-20250514`
- **Last Updated**: Mar 2025
- **Description**: Our most capable model. Price: $15 / MTok (Input), $75 / MTok (Output).
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 32,000 tokens
- **Key Features**: Superior reasoning, Vision, Extended thinking
- **Model Card**: Contact Anthropic for details

### Claude Sonnet 4
- **Model Code**: `claude-sonnet-4-20250514`
- **Last Updated**: Mar 2025
- **Description**: High-performance model with exceptional reasoning. Price: $3 / MTok (Input), $15 / MTok (Output).
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 64,000 tokens
- **Key Features**: High intelligence, Balanced performance, Vision
- **Model Card**: Contact Anthropic for details

### Claude Sonnet 3.7
- **Model Code**: `claude-3-7-sonnet-20250219`
- **Last Updated**: Nov 2024
- **Description**: High-performance model with toggleable extended thinking. Price: $3 / MTok (Input), $15 / MTok (Output).
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 64,000 tokens
- **Key Features**: High intelligence, Extended thinking, Vision
- **Model Card**: Contact Anthropic for details

### Claude Sonnet 3.5
- **Model Code**: `claude-3-5-sonnet-20241022`
- **Last Updated**: Apr 2024
- **Description**: Our previous intelligent model. Price: $3 / MTok (Input), $15 / MTok (Output).
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: High intelligence and capability, Vision
- **Model Card**: Contact Anthropic for details

### Claude Haiku 3.5
- **Model Code**: `claude-3-5-haiku-20241022`
- **Last Updated**: July 2024
- **Description**: Our fastest model for intelligence at blazing speeds. Price: $0.80 / MTok (Input), $4 / MTok (Output).
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 200,000 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Fastest model, Vision, Priority Tier access
- **Model Card**: Contact Anthropic for details

---

## xAI Grok Models

### Grok 4
- **Model Code**: `grok-4-latest`
- **Last Updated**: July 2025
- **Description**: Language model. Price: $3.00 - $15.00 per million tokens.
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 256,000 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Function calling, Structured outputs
- **Model Card**: https://docs.x.ai/docs/models/grok-4

### Grok 3
- **Model Code**: `grok-3`
- **Last Updated**: Feb 2025
- **Description**: Language model. Price: $3.00 - $15.00 per million tokens.
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 131,072 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Function calling, Structured outputs
- **Model Card**: https://docs.x.ai/docs/models/grok-3

### Grok 3 mini
- **Model Code**: `grok-3-mini`
- **Last Updated**: Feb 2025
- **Description**: Language model. Price: $0.30 - $0.50 per million tokens.
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 131,072 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Function calling, Structured outputs
- **Model Card**: https://docs.x.ai/docs/models/grok-3-mini

### Grok 3 mini fast
- **Model Code**: `grok-3-mini-fast
- **Last Updated**: Feb 2025
- **Description**: Language model. Price: $0.30 - $0.50 per million tokens.
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 131,072 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Function calling, Structured outputs
- **Model Card**: https://docs.x.ai/docs/models/grok-3-mini

### Grok 3 fast
- **Model Code**: `grok-3-fast`
- **Last Updated**: Feb 2025
- **Description**: Language model. Price: $5.00 - $25.00 per million tokens.
- **Inputs**: Text, Image
- **Outputs**: Text
- **Input Token Limit**: 131,072 tokens
- **Output Token Limit**: 8,192 tokens
- **Key Features**: Function calling, Structured outputs
- **Model Card**: https://docs.x.ai/docs/models/grok-3-fast

---

## Groq Models

### Groq Hardware Acceleration
Groq provides ultra-fast inference for various language models through their specialized Language Processing Units (LPUs). They offer access to models like:

- **Llama 3.1 405B**: Large context reasoning model
- **Llama 3.1 70B**: Versatile instruction-following model
- **Llama 3.1 8B**: Efficient model for lighter workloads


**Key Features**: Ultra-fast inference speeds, Hardware acceleration, Low latency, Cost-effective processing
**Model Documentation**: https://console.groq.com/docs/models

---

## Perplexity AI Models

### Perplexity Pro Search
Perplexity provides real-time search capabilities with AI-powered responses:

- **Search Models**: Real-time web search with citations
- **Pro Features**: Enhanced accuracy, longer responses, file uploads
- **API Access**: Programmatic access to search capabilities

**Key Features**: Real-time web search, Source citations, Factual accuracy, Current information
**Documentation**: https://docs.perplexity.ai/

---

## Moonshot AI Models

### Kimi Models
Moonshot AI offers the Kimi series with web search capabilities:

- **Kimi Chat**: Conversational AI with web search
- **Context Length**: Extended context windows
- **Web Integration**: Real-time web search and browsing

**Key Features**: Web search integration, Extended context, Chinese language optimization, Real-time information
**Documentation**: Contact Moonshot AI for API details

---

## Qwen Models

### Qwen (Alibaba Cloud) Models
Qwen offers various model sizes and capabilities:

- **Qwen2.5**: Latest generation with improved capabilities
- **Qwen-VL**: Vision-language model
- **Qwen-Audio**: Audio processing capabilities
- **CodeQwen**: Specialized for code generation

**Key Features**: Multimodal capabilities, Thinking mode, Chinese language optimization, Code generation
**Documentation**: https://help.aliyun.com/zh/dashscope/

---

## API Integration Guidelines

### Authentication
Most providers require API keys for authentication:
```bash
# OpenAI
Authorization: Bearer YOUR_API_KEY

# Google AI
x-goog-api-key: YOUR_API_KEY

# Anthropic
x-api-key: YOUR_API_KEY

# xAI
Authorization: Bearer YOUR_API_KEY
```

### Rate Limits
- **OpenAI**: Varies by model and tier (10,000 RPM for GPT-4o)
- **Google**: 60 requests per minute (free tier)
- **Anthropic**: Varies by plan
- **xAI**: Contact for details

### Error Handling
Common HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error

### Best Practices
1. Implement exponential backoff for rate limits
2. Use structured outputs when available
3. Monitor token usage for cost optimization
4. Implement proper error handling
5. Cache responses when appropriate
6. Use streaming for long responses

---

## Security Considerations

### API Key Management
- Store API keys securely (environment variables)
- Rotate keys regularly
- Monitor usage for anomalies
- Use least privilege access

### Data Privacy
- Be aware of data retention policies
- Consider on-premises solutions for sensitive data
- Review terms of service for each provider
- Implement proper data handling procedures

### Content Safety
- Use built-in moderation filters
- Implement custom content filtering
- Monitor outputs for harmful content
- Follow responsible AI practices

---

Last updated: July 25, 2025
