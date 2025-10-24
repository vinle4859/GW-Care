
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import ChatPanel from './components/chat/ChatPanel';
import PremiumShowcase from './components/premium/PremiumShowcase';
import Settings from './components/settings/Settings';
import SupportPlanView from './components/plan/SupportPlanView';
import AssessmentWizard from './components/assessment/AssessmentWizard';
import AssessmentResult from './components/assessment/AssessmentResult';
import { View } from './types';

export default function App() {
  const { isInitialized, currentView, assessmentData } = useContext(AppContext);
  const [showInitialAssessment, setShowInitialAssessment] = useState(false);

  useEffect(() => {
    if (isInitialized && !assessmentData?.lastCompleted) {
      setShowInitialAssessment(true);
    }
  }, [isInitialized, assessmentData]);


  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-shade-1 text-xl">Loading...</div>
      </div>
    );
  }

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'premium':
        return <PremiumShowcase />;
      case 'settings':
        return <Settings />;
      case 'plan':
        return <SupportPlanView />;
      case 'assessment':
        // If user has a result, show it. Otherwise, show the wizard.
        if (assessmentData?.result) {
            return <AssessmentResult />;
        }
        return <AssessmentWizard />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen font-sans text-shade-1 flex flex-col">
      <Header />
      <main className="p-4 sm:p-6 md:p-8 flex-grow min-h-0">
        {renderView()}
      </main>
      <ChatPanel />
      {showInitialAssessment && (
        <AssessmentWizard isInitialOnboarding={true} onClose={() => setShowInitialAssessment(false)} />
      )}
    </div>
  );
}