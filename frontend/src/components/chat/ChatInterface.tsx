import React, { useState, useRef, useEffect } from 'react';
import { generationService } from '../../services/api';
import { GlassPanel, GlassButton } from '../ui/GlassPanel';
import type { ChatInterfaceProps, ChatMessage } from '../../types/components';
import type { 
  Creation,
  CodeGenerationResponse, 
  APIGenerationResponse, 
  UIGenerationResponse, 
  CLIGenerationResponse 
} from '../../types/api';
import { Code, Globe, Palette, Terminal, Sparkles, Send } from 'lucide-react';

type GenerationType = 'code' | 'api' | 'ui' | 'cli';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, creations, setCreations }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 1, 
      text: `Welcome to AetherOS, ${user.name}! I'm your AI assistant ready to help you create anything you need. 
      
I can help you generate:
🔧 **Code** - Functions, scripts, algorithms
🌐 **APIs** - REST endpoints, OpenAPI specs  
🎨 **UIs** - React components, interfaces
⚡ **CLIs** - Command-line tools and utilities

What would you like to build today?`, 
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [generationType, setGenerationType] = useState<GenerationType>('code');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getGenerationFunction = (type: GenerationType) => {
    const functions = {
      code: generationService.generateCode,
      api: generationService.generateAPI,
      ui: generationService.generateUI,
      cli: generationService.generateCLI
    };
    return functions[type] || generationService.generateCode;
  };

  const formatGenerationResponse = (
    response: CodeGenerationResponse | APIGenerationResponse | UIGenerationResponse | CLIGenerationResponse, 
    type: GenerationType, 
    prompt: string
  ) => {
    const formats = {
      code: {
        text: `I've generated some ${(response as CodeGenerationResponse).language} code for you:`,
        content: (response as CodeGenerationResponse).code,
        language: (response as CodeGenerationResponse).language,
        name: `Generated ${(response as CodeGenerationResponse).language} Code`
      },
      api: {
        text: `I've created an API specification for you:`,
        content: (response as APIGenerationResponse).specification,
        language: 'yaml',
        name: `Generated API Specification`,
        metadata: (response as APIGenerationResponse).metadata
      },
      ui: {
        text: `I've created a React UI component for you:`,
        content: (response as UIGenerationResponse).component,
        language: 'jsx',
        name: `Generated UI Component`,
        framework: (response as UIGenerationResponse).framework
      },
      cli: {
        text: `I've created a CLI tool for you:`,
        content: (response as CLIGenerationResponse).code,
        language: (response as CLIGenerationResponse).language,
        name: `Generated CLI Tool`,
        executable: (response as CLIGenerationResponse).executable
      }
    };
    return formats[type] || formats.code;
  };

  const handleSend = async (): Promise<void> => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      timestamp: new Date(),
      generationType
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const generateFn = getGenerationFunction(generationType);
      const response = await generateFn(input);
      
      if (response.success) {
        const format = formatGenerationResponse(response, generationType, input);
        
        const systemMessage: ChatMessage = { 
          id: Date.now() + 1, 
          text: `${format.text}\n\n\`\`\`${format.language}\n${format.content}\n\`\`\`\n\nWould you like me to explain how it works or make any modifications?`, 
          sender: 'system',
          timestamp: new Date(),
          generationType,
          content: format.content,
          language: format.language,
          metadata: (format as any).metadata,
          framework: (format as any).framework,
          executable: (format as any).executable
        };
        setMessages(prev => [...prev, systemMessage]);

        // Create a new creation record
        const newCreation: Partial<Creation> = {
          id: Date.now() + 2,
          name: format.name,
          description: input,
          type: generationType,
          content: format.content,
          language: format.language,
          metadata: (format as any).metadata,
          framework: (format as any).framework,
          executable: (format as any).executable,
          timestamp: new Date()
        };
        setCreations(prev => [newCreation as Creation, ...prev]);
      } else {
        throw new Error(response.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage: ChatMessage = { 
        id: Date.now() + 1, 
        text: "I apologize, but I encountered an error while generating your request. Please try again or rephrase your request.", 
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (message: ChatMessage): React.ReactElement => {
    if (message.content && message.language) {
      const displayText = message.text.split('```')[0];
      const afterText = message.text.split('```')[2] || '';
      
      return (
        <div>
          <div className="mb-2">{displayText}</div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{message.content}</pre>
          </div>
          {afterText && <div className="mt-2">{afterText}</div>}
          {message.generationType && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(message.generationType)}`}>
                {message.generationType.toUpperCase()}
              </span>
              {message.executable && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  EXECUTABLE
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
    return <div className="whitespace-pre-wrap">{message.text}</div>;
  };

  const getTypeColor = (type: GenerationType): string => {
    const colors = {
      code: 'bg-blue-100 text-blue-800',
      api: 'bg-green-100 text-green-800',
      ui: 'bg-purple-100 text-purple-800',
      cli: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || colors.code;
  };

  const getPlaceholder = (type: GenerationType): string => {
    const placeholders = {
      code: "Describe the code you want to generate... (Press Enter to send, Shift+Enter for new line)",
      api: "Describe the API you want to create... (Press Enter to send, Shift+Enter for new line)",
      ui: "Describe the UI component you want to build... (Press Enter to send, Shift+Enter for new line)",
      cli: "Describe the CLI tool you want to create... (Press Enter to send, Shift+Enter for new line)"
    };
    return placeholders[type] || placeholders.code;
  };

  const getExampleText = (type: GenerationType): string => {
    const examples = {
      code: 'Try: "Create a Python function to calculate fibonacci numbers"',
      api: 'Try: "Build a REST API for user management with CRUD operations"',
      ui: 'Try: "Create a responsive dashboard component with charts"',
      cli: 'Try: "Build a file organizer CLI tool that sorts files by type"'
    };
    return examples[type] || examples.code;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <GlassPanel className="p-6 mb-4" variant="elevated" animate={false}>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-white" />
          <h1 className="text-2xl font-bold text-white">Generative Chat</h1>
        </div>
        <p className="text-white/80">Describe what you want to create and I'll generate it for you</p>
      </GlassPanel>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <GlassPanel 
              className={`max-w-3/4 p-4 ${message.sender === 'user' ? 'ml-16' : 'mr-16'}`}
              gradient={message.sender === 'user' ? 'neon' : 'default'}
              animate={false}
            >
              <div className="text-white/95">
                {formatMessage(message)}
              </div>
              <div className="text-xs mt-2 text-white/60">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </GlassPanel>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <GlassPanel className="p-4 mr-16" animate={false}>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                <span>Generating your request...</span>
              </div>
            </GlassPanel>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <GlassPanel className="p-4 mt-4" variant="elevated" animate={false}>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-white/80">Generation Type:</label>
          <div className="flex gap-2">
            {[
              { value: 'code', label: 'Code', icon: Code },
              { value: 'api', label: 'API', icon: Globe },
              { value: 'ui', label: 'UI', icon: Palette },
              { value: 'cli', label: 'CLI', icon: Terminal }
            ].map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setGenerationType(type.value as GenerationType)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${generationType === type.value 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white/90'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/50 rounded-lg p-3 resize-none focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all duration-200"
              placeholder={getPlaceholder(generationType)}
              rows={3}
              disabled={loading}
            />
          </div>
          <GlassButton
            onClick={handleSend}
            disabled={loading || !input.trim()}
            variant="primary"
            className="px-6 self-end h-fit"
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send
            </div>
          </GlassButton>
        </div>
        
        <div className="mt-2 text-xs text-white/60">
          {getExampleText(generationType)}
        </div>
      </GlassPanel>
    </div>
  );
};

export default ChatInterface;