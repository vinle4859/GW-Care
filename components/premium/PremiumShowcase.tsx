
import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import { SubscriptionTier } from '../../types';

// Icons for features
const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-shade-2 w-6 h-6 flex-shrink-0"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="7" width="14" height="10" rx="2" ry="2"/></svg>
);
const PlanIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-shade-2 w-6 h-6 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const TestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-shade-2 w-6 h-6 flex-shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const SessionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-shade-2 w-6 h-6 flex-shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-shade-2 w-6 h-6 flex-shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const DoctorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-shade-2 w-6 h-6 flex-shrink-0"><path d="M3 10h18"/><path d="M12 3v18"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0"/><path d="M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>
);
const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-shade-2 w-6 h-6 flex-shrink-0"><path d="m12 8-2 4 2 4 2-4-2-4z"/><path d="M20 12h2"/><path d="M2 12h2"/><path d="m18.36 5.64.14.14"/><path d="m5.5 18.5.14.14"/><path d="m18.5 18.5-.14.14"/><path d="m5.64 5.64-.14.14"/><path d="M12 2v2"/><path d="M12 20v2"/></svg>
);
const JournalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-shade-2 w-6 h-6 flex-shrink-0"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5Z"/></svg>
);


interface TierCardProps {
    tierKey: SubscriptionTier;
    tier: string;
    price: string;
    description: string;
    features: { text: string; icon: React.ReactNode }[];
    onSelect: (tier: SubscriptionTier) => void;
    isPrimary?: boolean;
}

const TierCard: React.FC<TierCardProps> = ({ tierKey, tier, price, description, features, onSelect, isPrimary=false }) => {
    const { t, subscriptionTier } = useContext(AppContext);
    const isCurrent = tierKey === subscriptionTier;
    
    return (
        <Card className={`flex flex-col h-full border-2 ${isPrimary ? 'border-shade-2 ring-4 ring-shade-2/20' : 'border-transparent'}`}>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-shade-1">{tier}</h3>
                <p className="mt-2 text-shade-1/80 min-h-[50px]">{description}</p>
                <div className="mt-6">
                    <span className="text-4xl font-bold text-shade-1">{price}</span>
                    { price !== t('premium.free_price') && <span className="text-sm text-shade-2/80 ml-1">/ {t('premium.per_month')}</span> }
                </div>
            </div>
            <div className="flex-grow p-6 bg-black/5 rounded-xl mt-4">
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            {feature.icon}
                            <span className="ml-3 text-shade-1">{feature.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-6 mt-auto flex flex-col items-center">
                <Button 
                    className="w-full" 
                    variant={isPrimary ? 'primary' : 'secondary'}
                    onClick={() => onSelect(tierKey)}
                    disabled={isCurrent}
                >
                    {isCurrent ? t('premium.current_plan') : t('premium.select_plan')}
                </Button>
                 <div className="h-6 mt-2">
                    { tierKey !== 'free' && <p className="text-center text-xs text-shade-2">{t('premium.cancel_anytime')}</p> }
                </div>
            </div>
        </Card>
    );
};


const PremiumShowcase: React.FC = () => {
    const { t, setSubscriptionTier } = useContext(AppContext);
    const [showCongratsModal, setShowCongratsModal] = useState(false);
    const [selectedTierName, setSelectedTierName] = useState('');

    const handleSelectTier = (tier: SubscriptionTier) => {
        setSubscriptionTier(tier);
        const tierName = t(`premium.${tier}_tier`);
        setSelectedTierName(tierName);
        setShowCongratsModal(true);
    };
    
    const tiers = [
        {
            key: 'free' as SubscriptionTier,
            tier: t('premium.free_tier'),
            price: t('premium.free_price'),
            description: t('premium.free_desc'),
            features: [
                { text: t('premium.free_feat1'), icon: <AIIcon /> },
                { text: t('premium.free_feat2'), icon: <JournalIcon /> },
                { text: t('premium.free_feat3'), icon: <ChatIcon /> }
            ]
        },
        {
            key: 'plus' as SubscriptionTier,
            tier: t('premium.plus_tier'),
            price: t('premium.plus_price'),
            description: t('premium.plus_desc'),
            features: [
                { text: t('premium.plus_feat1'), icon: <VideoIcon /> },
                { text: t('premium.plus_feat2'), icon: <PlanIcon /> },
                { text: t('premium.plus_feat3'), icon: <TestIcon /> },
                { text: t('premium.plus_feat4'), icon: <SessionIcon /> },
                { text: t('premium.plus_feat5'), icon: <ChatIcon /> },
            ],
            isPrimary: true,
        },
        {
            key: 'pro' as SubscriptionTier,
            tier: t('premium.pro_tier'),
            price: t('premium.pro_price'),
            description: t('premium.pro_desc'),
            features: [
                { text: t('premium.pro_feat1'), icon: <DoctorIcon /> },
                { text: t('premium.pro_feat2'), icon: <PlanIcon /> },
                { text: t('premium.pro_feat3'), icon: <TestIcon /> },
                { text: t('premium.pro_feat4'), icon: <SessionIcon /> },
                { text: t('premium.pro_feat5'), icon: <ChatIcon /> },
            ]
        }
    ];

    return (
        <div className="container mx-auto py-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-shade-1">{t('premium.title')}</h2>
                <p className="mt-4 text-lg text-shade-2 max-w-2xl mx-auto">{t('premium.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {tiers.map((tier) => (
                    <TierCard 
                        key={tier.key}
                        tierKey={tier.key}
                        tier={tier.tier}
                        price={tier.price}
                        description={tier.description}
                        features={tier.features}
                        isPrimary={tier.isPrimary}
                        onSelect={handleSelectTier}
                    />
                ))}
            </div>
            <Modal isOpen={showCongratsModal} onClose={() => setShowCongratsModal(false)} title={t('premium.congrats_title')}>
                <p className="text-center text-lg text-shade-4">{t('premium.congrats_message', { tier: selectedTierName })}</p>
                <Button onClick={() => setShowCongratsModal(false)} className="mt-6 w-full">
                    {t('premium.great')}
                </Button>
            </Modal>
        </div>
    );
};

export default PremiumShowcase;
