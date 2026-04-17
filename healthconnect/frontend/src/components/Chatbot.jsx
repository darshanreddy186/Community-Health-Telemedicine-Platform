import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import MicButton from './MicButton';

const INITIAL = [{ from: 'bot', text: 'Hi! I am your HealthConnect assistant. Ask me anything about your health.' }];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/chat', { message: text });
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch (err) {
      const msg = err.response?.data?.reply || 'Sorry, something went wrong. Please try again.';
      setMessages(prev => [...prev, { from: 'bot', text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition z-50"
        aria-label="Toggle chatbot"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <div>
              <p className="font-semibold text-sm">Health Assistant</p>
              <p className="text-xs text-blue-200">Powered by Gemini AI</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  m.from === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl rounded-bl-none shadow-sm">
                  <span className="flex gap-1 items-center text-gray-400 text-sm">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ask a health question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <MicButton onResult={(t) => setInput(prev => prev ? prev + ' ' + t : t)} />
            <button
              onClick={send}
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
