
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Mascot from '../shared/Mascot';
import { View } from '../../types';

const Header: React.FC = () => {
  const { language, setLanguage, t, currentView, setCurrentView } = useContext(AppContext);

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const NavButton: React.FC<{ view: View, label: string }> = ({ view, label }) => (
     <button onClick={() => setCurrentView(view)} className={`px-3 py-1.5 transition-colors rounded-lg text-sm font-semibold ${currentView === view ? 'bg-black/20 text-white' : 'hover:bg-black/10'}`}>
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/20 text-shade-1">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center h-20">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setCurrentView('dashboard')}
        >
          <Mascot className="w-10 h-10" />
          <h1 className="text-3xl font-bold tracking-wider">
            GW Care+
          </h1>
        </div>
        <nav className="flex items-center space-x-2 sm:space-x-4 bg-black/10 p-2 rounded-full text-white">
          <NavButton view="plan" label={t('header.my_plan')} />
          <NavButton view="assessment" label={t('header.test')} />
          <NavButton view="premium" label={t('header.premium')} />
          <NavButton view="settings" label={t('header.settings')} />
          <button
            onClick={toggleLanguage}
            className="border border-white/50 px-3 py-1.5 rounded-full text-xs hover:bg-white/20 transition-colors"
          >
            {language === 'vi' ? 'English' : 'Tiếng Việt'}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
