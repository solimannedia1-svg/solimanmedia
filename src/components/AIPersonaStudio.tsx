import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { QUICK_PROMPTS } from '../data/portfolioData';

export const AIPersonaStudio: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Greetings! I am AI Mohamed Soliman — Mohamed's digital alter-ego. Ask me anything about Mohamed's tech stack, WebGL shader design, Gemini AI integrations, or social media content strategy.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "I am currently processing high-density WebGL workflows. Let's create something extraordinary.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "System response degraded. Please ensure your Gemini API key is configured or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="ai-studio" className="py-28 px-6 md:px-16 max-w-[1440px] mx-auto relative z-20 border-t border-white/5">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Description & Prompt Chips */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span className="font-mono-code text-xs text-[#00daf3] uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00daf3] animate-pulse" />
            GEMINI 2.5 POWERED INTERACTIVE AI
          </span>

          <h2 className="font-space text-4xl md:text-5xl font-bold text-[#e1e3e4]">
            TALK TO AI MOHAMED
          </h2>

          <p className="font-body text-base text-[#c7c6ca] leading-relaxed">
            Experience an interactive conversational persona trained on Mohamed's engineering principles, creative code philosophy, and social media architecture.
          </p>

          <div className="space-y-2">
            <span className="font-mono-code text-xs text-[#79797e] uppercase tracking-wider block mb-2">
              QUICK PROMPT INQUIRIES
            </span>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="w-full text-left p-3 rounded-xl bg-[#1d2021] border border-white/5 hover:border-[#00daf3]/40 text-xs font-mono-code text-[#c7c6ca] hover:text-[#00daf3] transition-all interactive flex items-center justify-between group"
              >
                <span>"{prompt}"</span>
                <span className="material-symbols-outlined text-sm text-[#00daf3] opacity-0 group-hover:opacity-100 transition-opacity">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Chat Console Box */}
        <div className="lg:col-span-7 glass-card border border-[#00daf3]/30 rounded-2xl overflow-hidden flex flex-col h-[580px] shadow-2xl">
          {/* Header Bar */}
          <div className="p-4 bg-[#111415]/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00daf3]/20 border border-[#00daf3] flex items-center justify-center text-[#00daf3]">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div>
                <div className="font-space text-sm font-bold text-[#e1e3e4]">AI Mohamed Soliman</div>
                <div className="font-mono-code text-[10px] text-[#00daf3]">Gemini 2.5 Flash Proxy • Live</div>
              </div>
            </div>

            <span className="font-mono-code text-[11px] px-2.5 py-1 rounded bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/30">
              ONLINE
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 font-body text-sm bg-[#0c0f10]/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-[#00daf3]/20 border border-[#00daf3]/50 flex items-center justify-center text-[#00daf3] text-xs shrink-0 mt-1">
                    MS
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#00daf3] text-[#001f24] font-medium rounded-tr-none'
                      : 'bg-[#1d2021] text-[#e1e3e4] border border-white/10 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <span
                    className={`block text-[10px] font-mono-code mt-2 ${
                      msg.sender === 'user' ? 'text-[#004f58]' : 'text-[#79797e]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start items-center text-[#00daf3] font-mono-code text-xs">
                <div className="w-7 h-7 rounded-full bg-[#00daf3]/20 border border-[#00daf3]/50 flex items-center justify-center text-xs shrink-0">
                  MS
                </div>
                <div className="p-3 rounded-2xl bg-[#1d2021] border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00daf3] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00daf3] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00daf3] animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 text-[11px] text-[#79797e]">AI is processing response...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-[#111415] border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Mohamed about tech stack, projects, or strategy..."
              className="flex-1 bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] placeholder-[#79797e] focus:outline-none focus:border-[#00daf3] font-body"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="btn-primary px-6 py-3 rounded-xl font-mono-code text-xs uppercase font-bold flex items-center gap-1.5 disabled:opacity-50 interactive"
            >
              <span>SEND</span>
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
