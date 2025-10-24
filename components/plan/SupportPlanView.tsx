import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Mascot from '../shared/Mascot';

const SupportPlanView: React.FC = () => {
  const { supportPlan, t, setCurrentView } = useContext(AppContext);

  if (!supportPlan) {
    return (
       <div className="container mx-auto max-w-4xl text-center">
        <Card className="max-w-lg mx-auto">
            <Mascot className="mx-auto w-24 h-24 mb-4"/>
            <h2 className="text-2xl font-bold text-shade-1 mb-2">{t('plan.unlock_title')}</h2>
            <p className="text-shade-2 mb-6">{t('plan.not_generated')}</p>
            <Button onClick={() => setCurrentView('assessment')}>{t('plan.take_test_button')}</Button>
        </Card>
      </div>
    );
  }
  
  const safeWeekThemes = [
    'bg-shade-2', // purple-ish
    'bg-teal-500', 
    'bg-pink-400',
    'bg-shade-1'  // dark blue
  ];

  // For production, ensure custom colors are in tailwind config.
  // Using default tailwind colors for demonstration where they exist.
  const themeColors = [
      'bg-shade-2', // From theme
      'bg-purple-500',
      'bg-teal-500',
      'bg-shade-1', // From theme
  ];

  return (
    <div className="container mx-auto max-w-4xl">
       <h2 className="text-3xl font-bold text-shade-1 mb-8 text-center">{t('plan.title')}</h2>
        <Card>
            <div className="text-center mb-6">
                <p className="text-shade-2">{t('assessment.result_profile_label')}</p>
                <h3 className="text-2xl font-bold text-shade-1">{supportPlan.profile}</h3>
            </div>
            <div className="space-y-4">
                {supportPlan.plan.weeks.map((week, index) => (
                    <div key={index} className={`relative bg-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}>
                        <div className={`absolute top-0 left-0 h-full w-2 ${themeColors[index % themeColors.length]}`}></div>
                        <div className="py-4 pl-6 pr-4">
                            <h4 className="font-bold text-lg text-shade-1">{t('plan.week', { weekNum: index + 1 })}: {t(week.themeKey)}</h4>
                            <p className="text-shade-1/80 mt-1">{t(week.focusKey)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
  );
};

export default SupportPlanView;