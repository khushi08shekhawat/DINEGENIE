/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';

interface LunaProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessageText?: string;
  triggerToast?: (msg: string) => void;
  onAddToCart?: (
    restaurant: { id: string; name: string; deliveryTime: string },
    item: { name: string; price: number; isVeg: boolean; calories: string }
  ) => void;
}

const QUICK_SUGGESTIONS = [
  { text: "Recommend something under ₹300.", icon: "💰", description: "Delicious local budget options" },
  { text: "Healthy dinner.", icon: "🥗", description: "Fresh, low-calorie Jaipur picks" },
  { text: "Best cafe nearby.", icon: "☕", description: "Scenic views and rich coffees" },
  { text: "High protein meals.", icon: "💪", description: "Power packed cottage cheese & grains" },
  { text: "What should I eat today?", icon: "🎲", description: "Let the Genie choose your flavor" }
];

export default function Luna({ 
  isOpen, 
  onClose, 
  initialMessageText, 
  triggerToast = () => {}, 
  onAddToCart 
}: LunaProps) {
  // Load chat history from localStorage on initialization
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('dinegenie_luna_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
    }

    return [
      {
        id: 'welcome',
        sender: 'ai',
        text: "👋 **Pranam! Welcome to DineGenie's Royal AI Food Concierge!** 👑✨\n\nI am **Luna**, your personal culinary intelligence assistant here in Jaipur. I am trained on the finest local menus, hidden street-food gems, and nutritional profiles.\n\nHow may I curate your dining experience today? Select a prompt below or ask me anything!",
        timestamp: new Date(),
        suggestions: ["Recommend something under ₹300.", "Healthy dinner.", "What should I eat today?"]
      }
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingStatus, setTypingStatus] = useState("Consulting Jaipur chefs...");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('dinegenie_luna_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error("Error saving chat history:", e);
    }
  }, [messages]);

  // Handle initial trigger prompt
  useEffect(() => {
    if (initialMessageText && isOpen) {
      // Check if last message was same to prevent duplicates
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.text !== initialMessageText) {
        handleSendMessage(initialMessageText);
      }
    }
  }, [initialMessageText, isOpen]);

  // Handle auto scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Rotate typing statuses for aesthetic feel
    const statuses = [
      "Consulting Jaipur's culinary directory...",
      "Sifting through Tapri Central & LMB menus...",
      "Balancing macros and budget...",
      "Formulating premium gourmet recommendation..."
    ];
    let statusIdx = 0;
    const interval = setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      setTypingStatus(statuses[statusIdx]);
    }, 1500);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages.map(m => ({ sender: m.sender, text: m.text })),
          prompt: trimmed
        })
      });

      if (!response.ok) {
        throw new Error("Failed to call server chat API");
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I apologize, but I could not formulate a response at this time. What else can I help you find?",
        timestamp: new Date(),
        suggestions: data.suggestions || ["Recommend something under ₹300.", "Healthy dinner.", "Best cafe nearby."]
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: "🔌 **Connection Alert:** I am having a tiny connection wobble with my culinary spellbook. However, my local specialty is our **Truffle Mushroom Risotto** from Bella Italia or a hot plate of **Pyaaz Kachori** from LMB! Would you like to try that?",
        timestamp: new Date(),
        suggestions: ["Show me the menu", "Check other restaurants", "Try again"]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const processSpeechCommand = (transcript: string): boolean => {
    const text = transcript.toLowerCase().trim();
    
    // Check if command is an add-to-cart command or request
    if (!text.includes('add') && !text.includes('cart') && !text.includes('order') && !text.includes('put') && !text.includes('get')) {
      return false;
    }

    // Match menu items
    let matchedItem: any = null;
    let restaurant: any = null;

    if (text.includes('saffron') || text.includes('chai') || text.includes('tea')) {
      matchedItem = { name: 'Saffron Masala Chai', price: 90, isVeg: true, calories: '110 kcal' };
      restaurant = { id: 'rest-1', name: 'Tapri Central', deliveryTime: '25 mins' };
    } else if (text.includes('bun') || text.includes('maska')) {
      matchedItem = { name: 'Gourmet Bun Maska', price: 110, isVeg: true, calories: '290 kcal' };
      restaurant = { id: 'rest-1', name: 'Tapri Central', deliveryTime: '25 mins' };
    } else if (text.includes('maggie') || text.includes('noodles')) {
      matchedItem = { name: 'Spicy Maggie Tadka', price: 130, isVeg: true, calories: '340 kcal' };
      restaurant = { id: 'rest-1', name: 'Tapri Central', deliveryTime: '25 mins' };
    } else if (text.includes('khakhra')) {
      matchedItem = { name: 'Cheesy Garlic Khakhra', price: 150, isVeg: true, calories: '210 kcal' };
      restaurant = { id: 'rest-1', name: 'Tapri Central', deliveryTime: '25 mins' };
    }

    if (matchedItem && restaurant && onAddToCart) {
      // Determine quantity - Support words "two", "three", "four", "five", "one", or digits
      let quantity = 1;
      if (text.includes('two') || text.includes('2')) {
        quantity = 2;
      } else if (text.includes('three') || text.includes('3')) {
        quantity = 3;
      } else if (text.includes('four') || text.includes('4')) {
        quantity = 4;
      } else if (text.includes('five') || text.includes('5')) {
        quantity = 5;
      }

      // Add to cart 'quantity' times
      for (let i = 0; i < quantity; i++) {
        onAddToCart(restaurant, matchedItem);
      }

      // Add messages to chat
      const userMsg: ChatMessage = {
        id: `user-voice-${Date.now()}`,
        sender: 'user',
        text: `🎙️ "${transcript}"`,
        timestamp: new Date()
      };

      const aiMsg: ChatMessage = {
        id: `ai-voice-${Date.now()}`,
        sender: 'ai',
        text: `👑 **Royal Order Executed!** I've added **${quantity}x ${matchedItem.name}** from **${restaurant.name}** directly to your cart. 🛒✨\n\nWould you like me to recommend anything else or proceed to checkout?`,
        timestamp: new Date(),
        suggestions: ["Proceed to Checkout", "Recommend more from Tapri", "Close Luna"]
      };

      setMessages(prev => [...prev, userMsg, aiMsg]);
      return true;
    }

    return false;
  };

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Keep references to latest state to avoid stale closure issues
  const commandHandlerRef = useRef({ onAddToCart, handleSendMessage, processSpeechCommand });
  useEffect(() => {
    commandHandlerRef.current = { onAddToCart, handleSendMessage, processSpeechCommand };
  });

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        triggerToast("🎙️ Speech Recognition API is not supported in this browser. Please use Chrome or Safari.");
        return;
      }

      try {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-IN'; // Set to English (India) accent

        rec.onstart = () => {
          setIsListening(true);
          triggerToast("🎙️ DineGenie Listening... say: 'Luna, add two saffron chai to my cart'");
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          
          const handled = commandHandlerRef.current.processSpeechCommand(transcript);
          if (!handled) {
            commandHandlerRef.current.handleSendMessage(transcript);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error:", e);
          setIsListening(false);
          if (e.error === 'not-allowed') {
            triggerToast("🎙️ Microphone permission denied. Please allow mic access in your browser.");
          } else {
            triggerToast(`🎙️ Voice error: ${e.error}`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleClearHistory = () => {
    if (window.confirm("Would you like to clear your conversation history with Luna?")) {
      const welcomeMsg: ChatMessage = {
        id: 'welcome',
        sender: 'ai',
        text: "👋 **History cleared successfully!** 👑✨\n\nI am ready to curate a fresh gourmet culinary experience for you. Select one of our instant concierge chips below or start typing!",
        timestamp: new Date(),
        suggestions: ["Recommend something under ₹300.", "Healthy dinner.", "What should I eat today?"]
      };
      setMessages([welcomeMsg]);
    }
  };

  // Safe helper to parse Markdown text bold, bullet lists, emojis, etc.
  const renderFormattedMessage = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      let content: React.ReactNode = line;
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const isHeader = line.trim().startsWith('###') || line.trim().startsWith('##');

      if (isBullet) {
        const cleanLine = line.trim().replace(/^[•-]\s*/, '');
        content = (
          <span className="flex items-start gap-1.5 py-0.5">
            <span className="text-[#52B788] shrink-0 font-extrabold mt-1">•</span>
            <span className="text-xs sm:text-sm font-sans leading-relaxed text-[#1c2e24]">
              {parseBold(cleanLine)}
            </span>
          </span>
        );
      } else if (isHeader) {
        const cleanHeader = line.trim().replace(/^#{2,3}\s*/, '');
        content = (
          <h4 className="font-extrabold text-[#1b4332] text-sm font-display mt-2 mb-1">
            {parseBold(cleanHeader)}
          </h4>
        );
      } else {
        content = parseBold(line);
      }

      return (
        <div key={lineIdx} className={`${isBullet ? "ml-1" : isHeader ? "mb-1" : "mb-1.5 last:mb-0"} text-xs sm:text-sm leading-relaxed text-[#2D6A4F]/90`}>
          {content}
        </div>
      );
    });
  };

  const parseBold = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-[#1b4332] bg-[#D8F3DC]/30 px-1 py-0.5 rounded border border-[#B7E4C7]/20">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-[#FFFDF8] border-l border-[#B7E4C7]/40 shadow-premium-lg flex flex-col z-50 animate-in slide-in-from-right duration-300">
      
      {/* Header Panel */}
      <div className="p-4 border-b border-[#B7E4C7]/25 bg-gradient-to-r from-[#D8F3DC]/30 via-[#FFFDF8]/90 to-transparent flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#52B788]/20 to-[#B7E4C7]/30 rounded-2xl flex items-center justify-center border border-[#B7E4C7]/30 shadow-sm p-0.5">
              <img
                src="/src/assets/images/luna_robot_mascot_1783343509617.jpg"
                alt="Luna Mascot"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#52B788] border-2 border-[#FFFDF8] rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-[#1c2e24] font-display flex items-center gap-1">
                <span>✨ Luna</span>
              </h3>
              <span className="bg-[#52B788] text-white text-[8px] font-black px-1.5 py-0.5 rounded border border-[#52B788]/30 uppercase tracking-widest">
                CONCIERGE
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-[#52B788] rounded-full" />
              <p className="text-[10px] text-[#5e7166] font-semibold">Jaipur AI Culinary Guide</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title="Reset Chat History"
            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
          >
            <Lucide.Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#D8F3DC]/40 rounded-xl transition-all text-[#5e7166] hover:text-[#1c2e24] cursor-pointer"
          >
            <Lucide.X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Suggestions Shelf - ALWAYS available at the top for easy scrolling */}
      <div className="bg-[#F8F5F2]/40 border-b border-[#B7E4C7]/15 p-3 shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5 px-1">
          <Lucide.Compass className="w-3.5 h-3.5 text-[#52B788]" />
          <span className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-wider">Instant Concierge Queries</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
          {QUICK_SUGGESTIONS.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(item.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#D8F3DC]/35 border border-[#B7E4C7]/20 rounded-xl text-xs text-[#2D6A4F] transition-all hover:border-[#52B788] active:scale-95 shrink-0 snap-start cursor-pointer shadow-sm"
            >
              <span>{item.icon}</span>
              <span className="font-semibold whitespace-nowrap text-[11px]">{item.text.replace('.', '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gradient-to-b from-transparent to-[#F8F5F2]/30"
      >
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div className={`max-w-[88%] rounded-2xl p-4 shadow-sm ${
                isUser
                  ? 'bg-[#52B788] text-white rounded-tr-none font-medium border border-[#40916C]/10'
                  : 'bg-white text-[#1c2e24] border border-[#B7E4C7]/25 rounded-tl-none'
              }`}>
                {/* Message Text Renderer */}
                <div className={`${isUser ? 'text-white' : 'text-[#1c2e24]'}`}>
                  {renderFormattedMessage(msg.text)}
                </div>

                {/* Emojis or suggestions check */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && !isLoading && (
                  <div className="mt-4 pt-3 border-t border-[#B7E4C7]/15 space-y-2">
                    <p className="text-[9px] font-bold text-[#5e7166] uppercase tracking-wider flex items-center gap-1">
                      <Lucide.Sparkles className="w-2.5 h-2.5 text-[#52B788]" />
                      <span>Suggested follow-ups:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-2.5 py-1 bg-[#D8F3DC]/40 hover:bg-[#D8F3DC]/80 border border-[#B7E4C7]/30 text-[#2D6A4F] text-[10px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-emerald-100' : 'text-[#8fa395]'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Dynamic Typing Indicator with Pulsing food emojis */}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-200">
            <div className="bg-white text-[#1c2e24] border border-[#B7E4C7]/25 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-[#D8F3DC]/40 px-2 py-1 rounded-xl">
                  <div className="w-2 h-2 bg-[#52B788] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#52B788] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#52B788] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <div className="text-[11px] text-[#5e7166] font-medium animate-pulse">
                  {typingStatus}
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Replies Panel (Visible if the last message has suggestions and we are not loading) */}
      <AnimatePresence>
        {!isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'ai' && messages[messages.length - 1].suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 py-2 bg-[#FFFDF8] border-t border-[#B7E4C7]/10 flex gap-2 overflow-x-auto scrollbar-none shrink-0"
          >
            {messages[messages.length - 1].suggestions?.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(item)}
                className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#D8F3DC]/30 border border-[#B7E4C7]/20 hover:border-[#52B788] rounded-full text-xs font-bold text-[#2D6A4F] transition-all whitespace-nowrap active:scale-95 cursor-pointer shadow-sm flex items-center gap-1"
              >
                <Lucide.MessageSquare className="w-3 h-3 text-[#52B788]" />
                <span>{item}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Input Bar */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-[#B7E4C7]/20 bg-white flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Luna or say 'add two saffron chai'..."
          className="flex-1 px-4 py-3 bg-[#F8F5F2] border border-[#B7E4C7]/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent text-[#1c2e24] font-medium"
        />
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer shadow-md ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/20'
              : 'bg-[#D8F3DC] text-[#2D6A4F] hover:bg-[#B7E4C7] shadow-emerald-100/10 border border-[#B7E4C7]/30'
          }`}
          title={isListening ? "Listening... click to stop" : "Start Voice Assistant"}
        >
          {isListening ? (
            <Lucide.Mic className="w-4 h-4 animate-bounce" />
          ) : (
            <Lucide.Mic className="w-4 h-4" />
          )}
        </button>
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-[#52B788] hover:bg-[#40916C] text-white rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-[#52B788] active:scale-95 shadow-md shadow-[#52B788]/15 flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Lucide.Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
