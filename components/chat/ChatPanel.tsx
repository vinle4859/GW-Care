
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { sendChatMessage } from '../../services/geminiService';
import Mascot from '../shared/Mascot';
import Button from '../shared/Button';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const NewChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14m-7-7h14"/></svg>
);

const MicrophoneIcon = ({ isListening }: { isListening: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isListening && <circle cx="12" cy="12" r="10" className="text-red-500 animate-pulse" stroke="red" />}
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);

const CounselorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const DoctorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18"/><path d="M12 3v18"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0"/><path d="M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>
);


const ChatPanel: React.FC = () => {
  const { chatHistory, addChatMessage, setChatHistory, t, language, subscriptionTier } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeChat, setActiveChat] = useState<'ai' | 'counselor' | 'doctor'>('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isSpeechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSpeechSupported) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === 'vi' ? 'vi-VN' : 'en-US';

    recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
        setUserInput(transcript);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
    };

  }, [language, isSpeechSupported]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory, activeChat]);

  const handleSend = async () => {
    if (!userInput.trim() || isLoading) return;
    if (isListening) {
      recognitionRef.current?.stop();
    }
    const message = userInput.trim();
    addChatMessage({ role: 'user', text: message });
    setUserInput('');
    setIsLoading(true);

    const response = await sendChatMessage(message, chatHistory, language);
    addChatMessage({ role: 'model', text: response });
    setIsLoading(false);
  };

  const handleToggleListening = () => {
    if (!isSpeechSupported || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setUserInput('');
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };
  
  const handleNewChat = () => {
      setChatHistory([]);
      setActiveChat('ai');
  }

  const chatTitles = {
      ai: t('chat.title'),
      counselor: t('chat.counselor_chat'),
      doctor: t('chat.doctor_chat')
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-shade-2 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-shade-3 transition-all transform hover:scale-110"
        aria-label={t('chat.open')}
      >
        <ChatIcon />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96 h-[75vh] bg-shade-4/80 backdrop-blur-xl rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-white/20">
      <header className="bg-transparent p-4 flex justify-between items-center text-shade-1 border-b border-shade-1/10">
        <div className="flex items-center gap-2">
            <Mascot className="w-8 h-8"/>
            <h3 className="font-bold">{chatTitles[activeChat]}</h3>
        </div>
        <div className="flex items-center gap-2">
             <button onClick={handleNewChat} aria-label={t('chat.new_chat')} title={t('chat.new_chat')} className="text-shade-1/70 hover:text-shade-1"><NewChatIcon /></button>
            <button onClick={() => setIsOpen(false)} aria-label={t('chat.close')} className="text-shade-1/70 hover:text-shade-1"><CloseIcon /></button>
        </div>
      </header>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {activeChat === 'ai' ? (
            <>
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && <Mascot className="w-6 h-6 self-start"/>}
                    <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2 shadow ${msg.role === 'user' ? 'bg-shade-2 text-white rounded-br-none' : 'bg-white text-shade-1 rounded-bl-none'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                         <Mascot className="w-6 h-6 self-start"/>
                        <div className="bg-white text-shade-1 rounded-2xl rounded-bl-none px-4 py-2 shadow">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
            </>
        ) : (
            <div className="flex items-end gap-2 justify-start">
                <Mascot className="w-6 h-6 self-start"/>
                <div className="max-w-xs md:max-w-sm rounded-2xl px-4 py-2 shadow bg-white text-shade-1 rounded-bl-none">
                    <p className="text-sm">{t(activeChat === 'counselor' ? 'chat.counselor_soon' : 'chat.doctor_soon')}</p>
                </div>
            </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <footer className="p-2 border-t border-shade-1/10 bg-white/30">
        {activeChat !== 'ai' ? (
            <Button variant="secondary" className="w-full" onClick={() => setActiveChat('ai')}>
                {t('chat.back_to_ai')}
            </Button>
        ) : (
            <div className="space-y-2">
                {(subscriptionTier === 'plus' || subscriptionTier === 'pro') && (
                    <Button variant="ghost" className="w-full !justify-start text-sm py-2 border border-shade-2/50 !text-shade-1 flex items-center gap-2" onClick={() => setActiveChat('counselor')}>
                        <CounselorIcon /> {t('chat.counselor_chat')}
                    </Button>
                )}
                {subscriptionTier === 'pro' && (
                    <Button variant="ghost" className="w-full !justify-start text-sm py-2 border border-shade-2/50 !text-shade-1 flex items-center gap-2" onClick={() => setActiveChat('doctor')}>
                        <DoctorIcon /> {t('chat.doctor_chat')}
                    </Button>
                )}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('chat.placeholder')}
                    className="flex-grow p-2 border border-shade-3/20 rounded-lg bg-white/50 text-shade-1 placeholder-shade-1/60 focus:outline-none focus:ring-2 focus:ring-shade-2"
                    disabled={isLoading}
                  />
                  <button 
                    onClick={handleToggleListening}
                    disabled={!isSpeechSupported || isLoading}
                    className="p-2 rounded-lg text-shade-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!isSpeechSupported ? t('chat.mic_unsupported') : (isListening ? t('chat.listening') : t('chat.use_mic'))}
                    >
                      <MicrophoneIcon isListening={isListening} />
                  </button>
                  <button onClick={handleSend} disabled={isLoading || !userInput.trim()} className="bg-shade-2 text-white p-2 rounded-lg disabled:opacity-50"><SendIcon /></button>
                </div>
            </div>
        )}
      </footer>
    </div>
  );
};

export default ChatPanel;
