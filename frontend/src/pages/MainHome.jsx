// pages/MainHome.jsx
import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateAnswer } from '../services/gemini';
import { annotateText } from '../services/annotation';
import MarkerBadge from '../components/MarkerBadge';
import { Send, History, Info, LogOut } from 'lucide-react';
import GuideModal from '../components/GuideModal'; // Updated import
import logoShort from '../assets/logo-short.png';

const MainHome = () => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const scrollRef = useRef(null);

  // Check if user has seen guide before
  useEffect(() => {
    const seenGuide = localStorage.getItem('h4h_seen_guide');
    if (!seenGuide) {
      setShowGuide(true);
    } else {
      setHasSeenGuide(true);
    }
  }, []);

  const handleCloseGuide = () => {
    setShowGuide(false);
    setHasSeenGuide(true);
    localStorage.setItem('h4h_seen_guide', 'true');
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    const userQuery = question;
    setQuestion('');
    setChat(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      // 1. Get raw answer from Gemini
      const raw = await generateAnswer(userQuery);
      
      // 2. Get annotations from your Flask Backend
      const annotatedData = await annotateText(raw);

      const newResponse = {
        role: 'assistant',
        text: annotatedData.annotated_text,
        footnotes: annotatedData.footnotes,
        task: annotatedData.task_detected
      };

      setChat(prev => [...prev, newResponse]);

      // 3. Save to Firestore for Thesis History
      await addDoc(collection(db, 'questions'), {
        userId: auth.currentUser.uid,
        questionText: userQuery,
        annotatedAnswer: annotatedData.annotated_text,
        footnotes: annotatedData.footnotes,
        timestamp: serverTimestamp()
      });

    } catch (error) {
      console.error("Error in chat flow:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto border-x shadow-sm">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <img src={logoShort} alt="h4h" className="w-8 h-8" />
          <h1 className="text-xl font-bold bg-gradient-h4h bg-clip-text text-transparent italic">h4h</h1>
        </div>
        <div className="flex gap-3 text-gray-400">
          {/* Guide button */}
          <button
            onClick={() => setShowGuide(true)}
            className="hover:text-purple-600 transition-colors"
            title="Open Guide"
          >
            <Info size={20} />
          </button>
          <History size={20} className="cursor-pointer hover:text-purple-600" />
          <LogOut size={20} className="cursor-pointer hover:text-red-500" onClick={() => auth.signOut()} />
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {chat.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
             <div className="w-16 h-16 rounded-3xl bg-purple-50 flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
             </div>
             <h2 className="text-2xl font-bold text-gray-900">Welcome to human4human</h2>
             <p className="text-gray-500 mt-2">Start a conversation to see uncertainty markers in action.</p>
          </div>
        )}
        
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-3xl max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none' 
                : 'bg-purple-50 text-gray-800 rounded-tl-none border border-purple-100'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="space-y-4">
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.footnotes && (
                    <div className="mt-4 pt-3 border-t border-purple-200">
                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Footnotes</p>
                      {msg.footnotes.map(fn => (
                        <p key={fn.id} className="text-xs text-gray-500 mb-1">
                          <span className="font-bold">({fn.id})</span> {fn.explanation}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : msg.text}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs text-purple-400 animate-pulse">Analyzing certainty...</div>}
        <div ref={scrollRef} />
      </main>

      {/* Input Field */}
      <div className="p-4 bg-white border-t fixed bottom-0 w-full max-w-md">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full p-4 pr-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Ask anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 p-2 bg-gradient-h4h rounded-xl text-white shadow-md active:scale-95 transition-transform"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Guide Modal */}
      <GuideModal 
        isOpen={showGuide} 
        onClose={handleCloseGuide}
      />
    </div>
  );
};

export default MainHome;