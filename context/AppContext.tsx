
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { 
  Language, 
  UserData, 
  JournalEntry, 
  ChatMessage,
  View,
  SubscriptionTier,
  AssessmentData,
  DailyActivity,
  SupportPlan
} from '../types';
import { 
  INITIAL_USER_DATA, 
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_CHAT_HISTORY,
  INITIAL_ASSESSMENT_DATA,
  INITIAL_TODAY_ACTIVITIES
} from '../constants';

interface AppContextType {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: (key: string, options?: Record<string, string | number>) => string;
  isInitialized: boolean;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  addChatMessage: (message: ChatMessage) => void;
  resetAllData: () => void;
  currentView: View;
  setCurrentView: React.Dispatch<React.SetStateAction<View>>;
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: React.Dispatch<React.SetStateAction<SubscriptionTier>>;
  assessmentData: AssessmentData | null;
  setAssessmentData: React.Dispatch<React.SetStateAction<AssessmentData | null>>;
  todayActivities: { date: string, activities: DailyActivity[] } | null;
  setTodayActivities: React.Dispatch<React.SetStateAction<{ date: string, activities: DailyActivity[] } | null>>;
  supportPlan: SupportPlan | null; // This will hold the high-level plan
  setSupportPlan: React.Dispatch<React.SetStateAction<SupportPlan | null>>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('app-lang', 'vi');
  const [userData, setUserData] = useLocalStorage<UserData>('app-user-data', INITIAL_USER_DATA);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('app-journal-entries', INITIAL_JOURNAL_ENTRIES);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('app-chat-history', INITIAL_CHAT_HISTORY);
  const [subscriptionTier, setSubscriptionTier] = useLocalStorage<SubscriptionTier>('app-subscription-tier', 'free');
  const [assessmentData, setAssessmentData] = useLocalStorage<AssessmentData | null>('app-assessment-data', INITIAL_ASSESSMENT_DATA);
  const [todayActivities, setTodayActivities] = useLocalStorage<{ date: string, activities: DailyActivity[] } | null>('app-today-activities', INITIAL_TODAY_ACTIVITIES);
  const [supportPlan, setSupportPlan] = useLocalStorage<SupportPlan | null>('app-support-plan', null);
  
  const [translations, setTranslations] = useState<{en: any, vi: any}>({ en: {}, vi: {} });
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');


  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [enRes, viRes] = await Promise.all([
          fetch('/i18n/en.json'),
          fetch('/i18n/vi.json')
        ]);
        const enData = await enRes.json();
        const viData = await viRes.json();
        setTranslations({ en: enData, vi: viData });
      } catch (error) {
        console.error("Failed to load translation files:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadTranslations();
  }, []);

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    const langFile = translations[language] as Record<string, any>;
    if (!langFile || Object.keys(langFile).length === 0) {
        return key; // Return key if translations not loaded yet
    }
    
    let translation = key.split('.').reduce((acc, current) => acc?.[current], langFile) as string;

    if (!translation) {
      console.warn(`Translation key "${key}" not found for language "${language}".`);
      return key;
    }

    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{{${optionKey}}}`, String(options[optionKey]));
      });
    }

    return translation;
  }, [language, translations]);

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    setJournalEntries(prev => [...prev, { ...entry, id: new Date().toISOString() }]);
  };
  
  const addChatMessage = (message: ChatMessage) => {
      setChatHistory(prev => {
          const newHistory = [...prev, message];
          if (newHistory.length > 20) {
              return newHistory.slice(newHistory.length - 20);
          }
          return newHistory;
      });
  };

  const resetAllData = () => {
    setUserData(INITIAL_USER_DATA);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setChatHistory(INITIAL_CHAT_HISTORY);
    setSubscriptionTier('free');
    setAssessmentData(INITIAL_ASSESSMENT_DATA);
    setTodayActivities(INITIAL_TODAY_ACTIVITIES);
    setSupportPlan(null);
    localStorage.removeItem('app-user-data');
    localStorage.removeItem('app-journal-entries');
    localStorage.removeItem('app-chat-history');
    localStorage.removeItem('app-subscription-tier');
    localStorage.removeItem('app-assessment-data');
    localStorage.removeItem('app-today-activities');
    localStorage.removeItem('app-support-plan');
    window.location.reload();
  };
  
  const contextValue = {
    language,
    setLanguage,
    t,
    isInitialized,
    userData,
    setUserData,
    journalEntries,
    addJournalEntry,
    chatHistory,
    setChatHistory,
    addChatMessage,
    resetAllData,
    currentView,
    setCurrentView,
    subscriptionTier,
    setSubscriptionTier,
    assessmentData,
    setAssessmentData,
    todayActivities,
    setTodayActivities,
    supportPlan,
    setSupportPlan,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
