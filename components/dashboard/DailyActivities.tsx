
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import { DailyActivity } from '../../types';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);

interface DailyActivitiesProps {
  activities: DailyActivity[];
  onToggleComplete: (id: string) => void;
  isLoading: boolean;
}

const DailyActivities: React.FC<DailyActivitiesProps> = ({ activities, onToggleComplete, isLoading }) => {
  const { t } = useContext(AppContext);

  if (isLoading) {
      return (
          <Card>
              <h2 className="text-xl font-bold text-shade-1 mb-2">{t('activities.title')}</h2>
              <div className="animate-pulse space-y-3 mt-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-full"></div>
                  <div className="h-6 bg-gray-300 rounded w-5/6"></div>
              </div>
          </Card>
      );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-shade-1 mb-2">{t('activities.title')}</h2>
        <p className="text-shade-2">{t('activities.none')}</p>
      </Card>
    );
  }

  const completedCount = activities.filter(a => a.completed).length;
  const progress = (completedCount / activities.length) * 100;

  return (
    <Card>
      <h2 className="text-xl font-bold text-shade-1 mb-4">{t('activities.title')}</h2>
      <div className="space-y-3">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-center">
            <button
              onClick={() => onToggleComplete(activity.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-all flex-shrink-0 ${
                activity.completed ? 'bg-shade-2 border-shade-2 text-white' : 'border-shade-3 bg-white'
              }`}
            >
              {activity.completed && <CheckIcon />}
            </button>
            <span className={`flex-grow ${activity.completed ? 'line-through text-gray-500' : 'text-shade-1'}`}>
              {activity.taskKey ? t(activity.taskKey) : activity.task}
            </span>
          </div>
        ))}
      </div>
       <div className="mt-4">
        <div className="w-full bg-shade-3 rounded-full h-2.5">
          <div className="bg-shade-2 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-sm text-shade-2 mt-1">{t('activities.progress', { completed: completedCount, total: activities.length })}</p>
      </div>
    </Card>
  );
};

export default DailyActivities;
