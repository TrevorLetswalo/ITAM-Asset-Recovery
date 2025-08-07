import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, MinusIcon } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatAssistantProps {
  className?: string;
}

const mockQuestions = [
  "How do I return my loaner device?",
  "What does SLA stage 3 mean?",
  "How can I check my recovery status?",
  "What are the escalation rules?",
  "How do I exit the recovery protocol?",
  "Where can I find my device serial number?",
  "What happens if I miss the return deadline?",
  "How long does the recovery process take?"
];

export default function ChatAssistant({ className = "" }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your IT Asset Recovery Assistant. I can help you with device returns, SLA information, recovery status, and more. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="group relative p-4 bg-white/20 border border-white/30 backdrop-blur-lg rounded-full transition-all duration-300 hover:bg-white/30"
          style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}}
        >
          <MessageCircle className="w-6 h-6 text-[#2C8780]" />
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#72F1DC] rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className={`bg-white/20 border border-white/30 backdrop-blur-lg rounded-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
      }`} style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2C8780] to-[#72F1DC] rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1D1D2C]">IT Assistant</h3>
              <p className="text-xs text-[#2C8780]">Asset Recovery Support</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <MinusIcon className="w-4 h-4 text-[#1D1D2C]" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[#1D1D2C]" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 border-b border-white/20">
                <p className="text-xs text-[#2C8780] mb-3 font-medium">Quick Questions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {mockQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="text-left text-xs p-2 bg-white/20 backdrop-blur-lg hover:bg-white/30 rounded-lg transition-colors text-[#1D1D2C] border border-white/30"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: messages.length === 1 ? '380px' : '460px' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-[#2C8780] text-white'
                        : 'bg-white/40 text-[#1D1D2C] border border-white/30'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-white/70' : 'text-[#2C8780]'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#2C8780] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#2C8780] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#2C8780] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-[#1D1D2C] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C8780] focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-3 py-2 bg-gradient-to-r from-[#2C8780] to-[#72F1DC] text-white rounded-xl hover:from-[#2C8780]/90 hover:to-[#72F1DC]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
