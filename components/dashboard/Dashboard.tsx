

import React, { useContext, useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import DailyActivities from './DailyActivities';
import EmotionTree from '../emotion-tree/EmotionTree';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { AppContext } from '../../context/AppContext';
import { DailyActivity, SupportPlan } from '../../types';
import { GENERIC_ACTIVITIES } from '../../constants';
import { generateDailyActivities } from '../../services/geminiService';

const Dashboard: React.FC = () => {
  const {
    assessmentData,
    todayActivities,
    setTodayActivities,
    language,
    supportPlan, // High-level plan
    t,
    setCurrentView,
  } = useContext(AppContext);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      const today = new Date().toISOString().split('T')[0];

      if (todayActivities && todayActivities.date === today) {
        setActivities(todayActivities.activities);
        return;
      }

      setIsLoading(true);
      let newActivities: DailyActivity[] | null = null;

      if (assessmentData?.result?.profileKey && supportPlan) {
        try {
          const activityTemplates = await fetch('/data/activities/templates.json').then(res => res.json());
          newActivities = await generateDailyActivities(supportPlan.profile, activityTemplates, language);
        } catch (error) {
          console.error("Failed to generate AI activities", error);
        }
      }

      if (newActivities && newActivities.length > 0) {
        setTodayActivities({ date: today, activities: newActivities });
        setActivities(newActivities);
      } else {
        // Fallback to generic activities
        const shuffled = [...GENERIC_ACTIVITIES].sort(() => 0.5 - Math.random());
        const selectedActivities = shuffled.slice(0, 4).map(act => ({ ...act, completed: false }));
        setTodayActivities({ date: today, activities: selectedActivities });
        setActivities(selectedActivities);
      }
      setIsLoading(false);
    };

    fetchActivities();
  }, [assessmentData, supportPlan, language, setTodayActivities]);

  const handleToggleComplete = (id: string) => {
    const updatedActivities = activities.map(act =>
      act.id === id ? { ...act, completed: !act.completed } : act
    );
    setActivities(updatedActivities);
    if (todayActivities) {
        setTodayActivities({ ...todayActivities, activities: updatedActivities });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-1 space-y-6">
          <ProfileCard />
          <DailyActivities activities={activities} onToggleComplete={handleToggleComplete} isLoading={isLoading} />
           {!assessmentData?.lastCompleted && (
            <Card className="text-center">
                <p className="text-shade-2 mb-4">{t('profile.welcome_message')}</p>
                <Button onClick={() => setCurrentView('assessment')} className="w-full">
                    {t('profile.take_test')}
                </Button>
            </Card>
        )}
      </div>
      <div className="lg:col-span-2">
          <Card className="w-full h-full flex flex-col">
            <EmotionTree />
          </Card>
      </div>
    </div>
  );
};

export default Dashboard;