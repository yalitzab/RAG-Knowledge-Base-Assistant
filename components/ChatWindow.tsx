
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FAQ } from '../types';
import { generateAnswer } from '../services/geminiService';
import Icon from './common/Icon';
import Spinner from './common/Spinner';

interface ChatWindowProps {
  faqs: FAQ[];
  pdfText: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ faqs, pdfText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const answer = await generateAnswer(input, faqs, pdfText);
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: answer,
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Sorry, I ran into an issue. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg h-full flex flex-col">
      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 pt-8">
              <p className="text-lg">Welcome to the RAG Assistant!</p>
              <p>Add to the knowledge base or ask a question to get started.</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 flex-shrink-0 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Icon type="bot" className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-md lg:max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                 {msg.role === 'user' && (
                  <div className="w-8 h-8 flex-shrink-0 bg-slate-600 rounded-full flex items-center justify-center">
                    <Icon type="user" className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
           {isLoading && (
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 flex-shrink-0 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Icon type="bot" className="w-5 h-5 text-white" />
                  </div>
                <div className="bg-slate-700 p-3 rounded-lg flex items-center">
                    <Spinner className="w-5 h-5 text-slate-300" />
                </div>
              </div>
            )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 md:p-6 border-t border-slate-700">
        <div className="flex items-center bg-slate-700 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about the knowledge base..."
            className="w-full bg-transparent p-3 text-slate-200 placeholder-slate-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 text-slate-400 hover:text-indigo-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <Icon type="send" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
