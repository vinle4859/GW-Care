import React, { useContext, useState, ReactNode } from 'react';
import { AppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';

type SettingsTab = 'billing' | 'notifications' | 'profile' | 'theme' | 'privacy' | 'data' | 'regulation' | 'help' | 'support';

const ProfileSettings: React.FC = () => {
    const { userData, setUserData, t } = useContext(AppContext);
    const [nickname, setNickname] = useState(userData.nickname);
    const [statusTagline, setStatusTagline] = useState(userData.statusTagline);
    const [hasChanges, setHasChanges] = useState(false);

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
        setHasChanges(true);
    }
    const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatusTagline(e.target.value);
        setHasChanges(true);
    }

    const handleSave = () => {
        setUserData({ ...userData, nickname, statusTagline });
        setHasChanges(false);
    }

    return (
        <div>
            <h3 className="text-xl font-bold text-shade-1 mb-6">{t('settings.profile')}</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="nickname" className="block text-sm font-medium text-shade-2">{t('settings.profile_nickname')}</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={handleNicknameChange}
                        className="mt-1 block w-full px-3 py-2 bg-white/50 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-shade-2 focus:border-shade-2 text-shade-1"
                    />
                </div>
                 <div>
                    <label htmlFor="tagline" className="block text-sm font-medium text-shade-2">{t('settings.profile_tagline')}</label>
                    <input
                        type="text"
                        id="tagline"
                        value={statusTagline}
                        onChange={handleTaglineChange}
                        className="mt-1 block w-full px-3 py-2 bg-white/50 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-shade-2 focus:border-shade-2 text-shade-1"
                    />
                </div>
            </div>
            <div className="mt-6">
                <Button onClick={handleSave} disabled={!hasChanges}>{t('common.save')}</Button>
            </div>
        </div>
    );
};

const NotificationSettings: React.FC = () => {
    const { t } = useContext(AppContext);
    const [dailyLog, setDailyLog] = useState(true);

    return (
        <div>
             <h3 className="text-xl font-bold text-shade-1 mb-6">{t('settings.notifications')}</h3>
             <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
                <span>{t('settings.notif_daily_log')}</span>
                <button 
                    onClick={() => setDailyLog(!dailyLog)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${dailyLog ? 'bg-shade-2' : 'bg-gray-400'}`}
                >
                    <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${dailyLog ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
        </div>
    );
};

const RegulationContent: React.FC = () => {
    const { t } = useContext(AppContext);
    return (
        <div>
            <h3 className="text-xl font-bold text-shade-1 mb-6">{t('settings.regulation')}</h3>
            <div className="h-64 overflow-y-auto p-4 bg-white/10 rounded-lg space-y-4 text-base text-shade-1">
                <p><strong>{t('settings.reg_title1')}</strong> {t('settings.reg_text1')}</p>
                <p><strong>{t('settings.reg_title2')}</strong> {t('settings.reg_text2')}</p>
                <p><strong>{t('settings.reg_title3')}</strong> {t('settings.reg_text3')}</p>
                 <p><strong>{t('settings.reg_title4')}</strong> {t('settings.reg_text4')}</p>
            </div>
        </div>
    )
}

const SupportContent: React.FC = () => {
    const { t } = useContext(AppContext);
    return (
         <div>
            <h3 className="text-xl font-bold text-shade-1 mb-6">{t('settings.support_contact')}</h3>
            <div className="space-y-4 text-base text-shade-1">
                <p>{t('settings.support_desc')}</p>
                <p><strong>Email:</strong> <a href="mailto:support@gw-care.example.com" className="text-shade-1 hover:underline">support@gw-care.example.com</a></p>
                <p><strong>{t('settings.support_hotline')}:</strong> <span className="text-shade-1 font-semibold">1-800-GLOWY-CARE</span></p>
            </div>
        </div>
    )
}


const Settings: React.FC = () => {
    const { resetAllData, t } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

    const handleReset = () => {
        if (window.confirm(t('profile.reset_confirm'))) {
            resetAllData();
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'notifications':
                return <NotificationSettings />;
            case 'regulation':
                return <RegulationContent />;
            case 'support':
                return <SupportContent />;
            case 'data':
                return (
                    <div>
                        <h3 className="text-xl font-bold text-shade-1 mb-4">{t('settings.data_management')}</h3>
                        <p className="text-shade-2 mb-4">{t('settings.reset_description')}</p>
                        <Button variant="secondary" onClick={handleReset}>{t('profile.reset_data')}</Button>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-10">
                        <h3 className="text-2xl font-bold text-shade-1">{t('settings.coming_soon_title')}</h3>
                        <p className="text-shade-2 mt-2">{t('settings.coming_soon_desc')}</p>
                    </div>
                );
        }
    }
    
    const TabButton = ({ tab, label }: { tab: SettingsTab, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-white/30 text-shade-1 font-semibold' : 'text-shade-1/70 hover:bg-white/10 hover:text-shade-1'}`}
        >
            {label}
        </button>
    )

    return (
        <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-shade-1 mb-8 text-center">{t('settings.title')}</h2>
            <Card className="p-0 sm:p-0">
                <div className="flex flex-col md:flex-row min-h-[60vh]">
                    <div className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-white/20">
                        <nav className="space-y-2">
                           <TabButton tab="profile" label={t('settings.profile')} />
                           <TabButton tab="notifications" label={t('settings.notifications')} />
                           <TabButton tab="theme" label={t('settings.theme')} />
                           <TabButton tab="regulation" label={t('settings.regulation')} />
                           <TabButton tab="help" label={t('settings.help')} />
                           <TabButton tab="support" label={t('settings.support_contact')} />
                           <TabButton tab="privacy" label={t('settings.privacy')} />
                           <TabButton tab="billing" label={t('settings.billing')} />
                           <TabButton tab="data" label={t('settings.data_management')} />
                        </nav>
                    </div>
                    <div className="w-full md:w-2/3 p-6 md:p-8">
                        {renderContent()}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Settings;