import React, { useState, useRef, useEffect } from 'react';
import { generationService } from '../../services/api';
import type { ChatInterfaceProps, ChatMessage } from '../../types/components';
import type { 
  Creation,
  CodeGenerationResponse, 
  APIGenerationResponse, 
  UIGenerationResponse, 
  CLIGenerationResponse 
} from '../../types/api';

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
    <div className="flex flex-col h-screen bg-white">
      <div className="border-b border-gray-200 p-4 bg-white">
        <h1 className="text-2xl font-bold text-gray-800">Generative Chat</h1>
        <p className="text-gray-600">Describe what you want to create and I'll generate it for you</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-4 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-liquid-blue text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {formatMessage(message)}
              <div className="text-xs mt-2 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-liquid-blue border-t-transparent rounded-full"></div>
                <span>Generating your request...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium text-gray-700">Generation Type:</label>
          <select
            value={generationType}
            onChange={(e) => setGenerationType(e.target.value as GenerationType)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-liquid-blue"
          >
            <option value="code">🔧 Code</option>
            <option value="api">🌐 API</option>
            <option value="ui">🎨 UI Component</option>
            <option value="cli">⚡ CLI Tool</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-liquid-blue focus:border-transparent"
            placeholder={getPlaceholder(generationType)}
            rows={3}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-liquid-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-liquid-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {getExampleText(generationType)}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;