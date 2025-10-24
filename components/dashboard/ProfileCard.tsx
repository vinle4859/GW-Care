
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import UserProfileIcon from '../shared/UserProfileIcon';
import Mascot from '../shared/Mascot';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);

const ProfileCard: React.FC = () => {
  const { userData, t, setCurrentView, assessmentData } = useContext(AppContext);

  const handleEditClick = () => {
      setCurrentView('settings');
  };

  return (
    <Card>
      <div className="flex items-center space-x-4">
        {!assessmentData?.lastCompleted ? (
          <Mascot className="w-16 h-16 flex-shrink-0" />
        ) : (
          <UserProfileIcon />
        )}
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-shade-1">
            {!assessmentData?.lastCompleted
              ? t('profile.welcome_named', { name: userData.nickname })
              : userData.nickname}
          </h2>
          <p className="text-shade-2">{userData.statusTagline}</p>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <Button onClick={handleEditClick} variant="ghost" className="flex items-center space-x-1 hover:text-shade-1">
            <EditIcon />
            <span>{t('profile.edit_profile')}</span>
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;