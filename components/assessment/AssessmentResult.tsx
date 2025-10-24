
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Mascot from '../shared/Mascot';

const AssessmentResult: React.FC = () => {
    const { t, assessmentData, setAssessmentData, setCurrentView, subscriptionTier } = useContext(AppContext);

    if (!assessmentData || !assessmentData.result) {
        // This case should ideally not be reached if routing is correct
        return (
            <Card>
                <p>{t('assessment.submit_error')}</p>
                <Button onClick={() => setCurrentView('assessment')}>
                    {t('plan.take_test_button')}
                </Button>
            </Card>
        );
    }
    
    const profileName = t(`assessment.${assessmentData.result.profileKey}_name`);
    const profileDesc = t(`assessment.${assessmentData.result.profileKey}_desc`);
    
    const isPremium = subscriptionTier === 'plus' || subscriptionTier === 'pro';

    const canRetake = () => {
        if (isPremium) return true;
        if (!assessmentData.lastCompleted) return true;

        const lastCompletedDate = new Date(assessmentData.lastCompleted);
        const oneMonthLater = new Date(lastCompletedDate.setMonth(lastCompletedDate.getMonth() + 1));
        return new Date() >= oneMonthLater;
    };

    const handleRetake = () => {
        // Clear previous results to restart the wizard
        setAssessmentData(prev => ({
            ...prev!,
            result: null,
            lastCompleted: null,
        }));
    };
    
    const getNextAvailableDate = () => {
        if (!assessmentData.lastCompleted) return '';
        const lastCompletedDate = new Date(assessmentData.lastCompleted);
        const oneMonthLater = new Date(lastCompletedDate.setMonth(lastCompletedDate.getMonth() + 1));
        return oneMonthLater.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    return (
        <div className="container mx-auto max-w-2xl text-center">
            <Card>
                <Mascot className="mx-auto w-24 h-24 mb-4"/>
                <h2 className="text-3xl font-bold text-shade-1 mb-4">{t('assessment.result_title')}</h2>
                
                <div className="bg-white/10 p-4 rounded-lg">
                    <p className="text-shade-2">{t('assessment.result_profile_label')}</p>
                    <h3 className="text-2xl font-bold text-shade-1 mt-1">{profileName}</h3>
                    <p className="text-shade-2 mt-2">{profileDesc}</p>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button onClick={() => setCurrentView('dashboard')} variant="secondary">
                        {t('assessment.result_dashboard_button')}
                    </Button>
                    <Button onClick={() => setCurrentView('plan')}>
                        {t('assessment.result_view_plan_button')}
                    </Button>
                </div>

                <div className="mt-4">
                    {canRetake() ? (
                        <Button onClick={handleRetake} variant="ghost" className="w-full">
                            {t('assessment.result_retake_button')}
                        </Button>
                    ) : (
                        <p className="text-sm text-shade-2">{t('assessment.result_come_back', { date: getNextAvailableDate() })}</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AssessmentResult;