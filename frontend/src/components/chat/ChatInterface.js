import React, { useState, useRef, useEffect } from 'react';
import { generationService } from '../../services/api';

const ChatInterface = ({ user, creations, setCreations }) => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `Welcome to LiquidOS, ${user.name}! I'm your AI assistant ready to help you create anything you need. What would you like to build today?`, 
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await generationService.generateCode(input);
      
      if (response.success) {
        const systemMessage = { 
          id: Date.now() + 1, 
          text: `I've generated some ${response.language} code for you:\n\n\`\`\`${response.language}\n${response.code}\n\`\`\`\n\nWould you like me to explain how it works or make any modifications?`, 
          sender: 'system',
          timestamp: new Date(),
          code: response.code,
          language: response.language
        };
        setMessages(prev => [...prev, systemMessage]);

        // Create a new creation record
        const newCreation = {
          id: Date.now() + 2,
          name: `Generated ${response.language} Code`,
          description: input,
          type: 'code',
          content: response.code,
          language: response.language,
          timestamp: new Date()
        };
        setCreations(prev => [newCreation, ...prev]);
      } else {
        throw new Error(response.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = { 
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (message) => {
    if (message.code) {
      return (
        <div>
          <div className="mb-2">{message.text.split('```')[0]}</div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{message.code}</pre>
          </div>
          <div className="mt-2">{message.text.split('```')[2]}</div>
        </div>
      );
    }
    return <div className="whitespace-pre-wrap">{message.text}</div>;
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
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-liquid-blue focus:border-transparent"
            placeholder="Describe what you want to create... (Press Enter to send, Shift+Enter for new line)"
            rows="3"
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
          Try: "Create a Python function to calculate fibonacci numbers" or "Build a REST API endpoint for user management"
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;