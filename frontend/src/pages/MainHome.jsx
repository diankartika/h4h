// pages/MainHome.jsx
import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { generateAnswer } from '../services/gemini';
import { annotateText } from '../services/annotation';
import { askH4H } from '../controllers/QuestionController';
import { getQuestionsCount } from '../services/firebase';
import { AnnotatedText } from '../components/AnnotatedText';
import GuideModal from '../components/GuideModal';
import FootnoteModal from '../components/FootnoteModal';
import HistorySidebar from '../components/HistorySidebar';
import logoShort from '../assets/logo-short.png';
import logoSmall from '../assets/logo-small.png';

const QUESTION_LIMIT = 9999;
const FEEDBACK_FORM_URL = "https://forms.google.com/your-form-url"; // Replace with your actual form URL

const MainHome = () => {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [selectedFootnotes, setSelectedFootnotes] = useState(null);
  const [showFootnoteModal, setShowFootnoteModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
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

  // Get question count
  useEffect(() => {
    const getCount = async () => {
      if (auth.currentUser) {
        const count = await getQuestionsCount(auth.currentUser.uid);
        setQuestionCount(count);
      }
    };
    getCount();
  }, [chat]);

  const handleCloseGuide = () => {
    setShowGuide(false);
    setHasSeenGuide(true);
    localStorage.setItem('h4h_seen_guide', 'true');
  };

  const handleFootnoteClick = (footnotes) => {
    setSelectedFootnotes(footnotes);
    setShowFootnoteModal(true);
  };

  const handleSelectConversation = (conv) => {
    setChat([
      { role: 'user', text: conv.questionText },
      { 
        role: 'assistant', 
        text: conv.annotatedText,
        footnotes: conv.footnotes,
        task: conv.taskDetected
      }
    ]);
  };

  const handleSend = async () => {
    if (!question.trim()) return;
    if (questionCount >= QUESTION_LIMIT) return;

    const userQuery = question;
    setQuestion('');
    setChat(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      console.log('=== DEBUG START ===');
      console.log('1. Question:', userQuery);
      console.log('2. Auth state:', auth.currentUser ? 'Logged in' : 'Test mode');
      
      let result;
      
      // If user is logged in, use full flow with Firestore
      if (auth.currentUser) {
        result = await askH4H(userQuery);
        const newCount = await getQuestionsCount(auth.currentUser.uid);
        setQuestionCount(newCount);
      } 
      // Test mode: skip Firestore, just call APIs directly
      else {
        console.log('3. TEST MODE: Calling Gemini...');
        const rawAnswer = await generateAnswer(userQuery);
        console.log('4. Gemini response:', rawAnswer.substring(0, 100) + '...');
        
        console.log('5. Calling annotation API...');
        const annotationResult = await annotateText(rawAnswer);
        console.log('6. Annotation result:', annotationResult);
        
        result = {
          annotatedText: annotationResult.annotated_text,
          footnotes: annotationResult.footnotes,
          taskDetected: annotationResult.task_detected
        };
        
        // Increment count locally in test mode
        setQuestionCount(prev => prev + 1);
      }

      const newResponse = {
        role: 'assistant',
        text: result.annotatedText,
        footnotes: result.footnotes,
        task: result.taskDetected
      };

      console.log('7. Final response:', newResponse);
      console.log('=== DEBUG END ===');
      
      setChat(prev => [...prev, newResponse]);

    } catch (error) {
      console.error("❌ Error in chat flow:", error);
      console.error("Error details:", error.message);
      console.error("Stack:", error.stack);
      
      setChat(prev => [...prev, { 
        role: 'assistant', 
        text: `Sorry, there was an error: ${error.message}`,
        footnotes: []
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFeedback = () => {
    window.open(FEEDBACK_FORM_URL, '_blank');
  };

  return (
    <div className="flex flex-col h-screen bg-white w-full max-w-md mx-auto relative">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-start border-b border-gray-100">
        {/* Left side - History and Logo */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHistory(true)}
            className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 18 21" fill="none">
              <path d="M8.92279 1.97591C9.18529 1.18841 8.75873 0.339975 7.97591 0.077475C7.1931 -0.185025 6.33998 0.241538 6.07748 1.02435L0.0774751 19.0244C-0.185025 19.8119 0.241537 20.6603 1.02435 20.9228C1.80716 21.1853 2.66029 20.7587 2.92279 19.9759L8.92279 1.97591ZM12.2462 0.0212252C11.4306 -0.114712 10.6572 0.438412 10.5212 1.25404L7.52122 19.254C7.38529 20.0697 7.93841 20.8431 8.75404 20.979C9.56966 21.115 10.3431 20.5619 10.479 19.7462L13.479 1.74623C13.615 0.9306 13.0618 0.157163 12.2462 0.0212252ZM16.4978 0.00247509C15.6681 0.00247509 14.9978 0.672788 14.9978 1.50248V19.5025C14.9978 20.3322 15.6681 21.0025 16.4978 21.0025C17.3275 21.0025 17.9978 20.3322 17.9978 19.5025V1.50248C17.9978 0.672788 17.3275 0.00247509 16.4978 0.00247509Z" fill="black"/>
            </svg>
          </button>
          
          <span
            style={{
              fontFamily: 'Inter',
              fontSize: '11px',
              fontWeight: 400,
              lineHeight: 'normal',
              background: 'linear-gradient(90deg, #000 0%, #715579 50%, #96C8F4 75%, #57EFBD 87.5%, #E2A9F1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            human4human
          </span>
        </div>

        {/* Right side - Guide button */}
        <button
          onClick={() => setShowGuide(true)}
          className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17" fill="none">
            <path d="M11.375 0H1.625C0.73125 0 0 0.765 0 1.7V15.3C0 16.235 0.73125 17 1.625 17H11.375C12.2688 17 13 16.235 13 15.3V1.7C13 0.765 12.2688 0 11.375 0ZM1.625 1.7H5.6875V8.5L3.65625 7.225L1.625 8.5V1.7Z" fill="black"/>
          </svg>
          <span
            style={{
              color: '#000',
              fontFamily: 'Inter',
              fontSize: '10px',
              fontWeight: 400,
              lineHeight: 'normal'
            }}
          >
            Guide
          </span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-24 pt-6">
        {chat.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <h1
              style={{
                fontFamily: 'Inter',
                fontSize: '28px',
                fontWeight: 400,
                lineHeight: 'normal',
                background: 'linear-gradient(90deg, #000 0%, #715579 19.23%, #459DEA 50%, #5CC5A2 80.29%, #B652D1 94.71%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              What's in your mind?
            </h1>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6">
            {chat.map((message, index) => (
              <div key={index} className="mb-8">
                {message.role === 'user' ? (
                  <div className="flex justify-end mb-6">
                    <div
                      className="max-w-[80%] px-4 py-3"
                      style={{
                        borderRadius: '18px',
                        background: 'rgba(243, 198, 255, 0.45)',
                        color: '#000',
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '1.5'
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    {/* AI Response - Clean layout like Gemini */}
                    <div
                      style={{
                        fontFamily: 'Inter',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '1.7',
                        color: '#1f1f1f'
                      }}
                    >
                      <AnnotatedText text={message.text} />
                    </div>

                    {/* Footnote button */}
                    {message.footnotes && message.footnotes.length > 0 && (
                      <button
                        onClick={() => handleFootnoteClick(message.footnotes)}
                        className="mt-4 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                        style={{
                          padding: '8px 14px',
                          borderRadius: '20px',
                          border: '1px solid #dadce0',
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <span
                          style={{
                            color: '#5f6368',
                            fontFamily: 'Inter',
                            fontSize: '13px',
                            fontWeight: 500
                          }}
                        >
                          View footnotes ({message.footnotes.length})
                        </span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none"
                        >
                          <path d="M4 6L8 10L12 6" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div 
                className="mb-6"
                style={{
                  color: '#5f6368',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}
              >
                Analyzing confidence...
              </div>
            )}

            {questionCount >= QUESTION_LIMIT && (
              <div
                className="p-4 mb-6"
                style={{
                  borderRadius: '12px',
                  background: '#e8f5e9',
                  border: '1px solid #a5d6a7'
                }}
              >
                <p
                  className="mb-2"
                  style={{
                    color: '#1b5e20',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  You've reached your limit (5 questions)
                </p>
                <button
                  onClick={handleFeedback}
                  className="mt-2 hover:opacity-90 transition-opacity"
                  style={{
                    padding: '6px 16px',
                    borderRadius: '20px',
                    background: '#43A047',
                    color: '#fff',
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Give feedback
                </button>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        )}
      </main>

      <div className="text-[10px] text-gray-400 mb-1 text-right px-2">
        Usage: {questionCount} / {QUESTION_LIMIT} questions used
      </div>

      {/* Input area - fixed at bottom */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-gray-100">
        <div
          className="relative flex items-center mx-auto"
          style={{
            maxWidth: '100%',
            height: '44px',
            borderRadius: '22px',
            border: '1px solid #dadce0',
            background: '#fff',
            padding: '0 12px'
          }}
        >
          <img src={logoSmall} alt="h4h" className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-black"
            placeholder="try to ask me anything!"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={questionCount >= QUESTION_LIMIT}
            style={{
              fontFamily: 'Inter',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 'normal',
              color: '#202124'
            }}
          />
          <button 
            type="button"
            onClick={handleSend}
            disabled={questionCount >= QUESTION_LIMIT}
            className="flex-shrink-0 relative hover:opacity-80 transition-opacity"
            style={{
              width: '32px',
              height: '32px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: question.trim() && questionCount < QUESTION_LIMIT ? '#1a73e8' : '#dadce0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
              >
                <path d="M8 2L14 8M8 2L2 8M8 2V14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectConversation={handleSelectConversation}
      />

      {/* Guide Modal */}
      <GuideModal 
        isOpen={showGuide} 
        onClose={handleCloseGuide}
      />

      {/* Footnote Modal */}
      <FootnoteModal 
        isOpen={showFootnoteModal}
        onClose={() => setShowFootnoteModal(false)}
        footnotes={selectedFootnotes}
      />
    </div>
  );
};

export default MainHome;