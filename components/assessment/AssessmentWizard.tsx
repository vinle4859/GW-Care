import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import { AssessmentAnswers, SupportPlan } from '../../types';

interface Question {
  id: string;
  textKey: string;
  optionsKey?: string;
  optionsCount?: number;
  placeholderKey?: string;
  type?: string;
}

interface AssessmentWizardProps {
  isInitialOnboarding?: boolean;
  onClose?: () => void;
}

const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ isInitialOnboarding = false, onClose }) => {
  const { t, setAssessmentData, assessmentData, subscriptionTier, setCurrentView, setSupportPlan } = useContext(AppContext);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [scoringRules, setScoringRules] = useState<any>({});
  const [resultProfiles, setResultProfiles] = useState<any[]>([]);
  const [planTemplates, setPlanTemplates] = useState<SupportPlan[]>([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(assessmentData?.answers || {});
  const [isLoading, setIsLoading] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, sRes, pRes] = await Promise.all([
          fetch('/data/assessment/questions.json'),
          fetch('/data/assessment/results.json'),
          fetch('/data/plans/sample-plans.json'),
        ]);
        const qData = await qRes.json();
        const sData = await sRes.json();
        const pData = await pRes.json();

        setQuestions(qData.questions);
        setScoringRules(sData.scoring);
        setResultProfiles(sData.profiles);
        setPlanTemplates(pData);

      } catch (error) {
        console.error("Failed to load assessment data:", error);
      }
    };
    fetchData();
  }, []);

  const totalSteps = questions.length;
  const isPremium = subscriptionTier === 'plus' || subscriptionTier === 'pro';
  const currentQuestion = questions[currentStep];

  const handleAnswer = (questionId: string, answer: number | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => setCurrentStep(s => Math.min(s + 1, totalSteps - 1));
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setCurrentView('dashboard');
    }
  };

  const isCurrentQuestionAnswered = () => {
      if (!currentQuestion) return false;
      const answer = answers[currentQuestion.id];
      return answer !== undefined && answer !== '';
  }

  const canSubmit = useMemo(() => {
    if (!questions || questions.length === 0) return false;
    
    // Count how many valid multiple-choice questions have been answered.
    const answeredMcqCount = Object.keys(answers).reduce((count, questionId) => {
        const question = questions.find(q => q.id === questionId);
        // A valid MCQ answer is one for a non-textarea question with a numeric value.
        if (question && question.type !== 'textarea' && typeof answers[questionId] === 'number') {
            return count + 1;
        }
        return count;
    }, 0);

    // There are 29 multiple-choice questions that need to be answered.
    return answeredMcqCount >= 29;
  }, [answers, questions]);


  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    try {
        let totalScore = 0;
        // The scoring logic correctly iterates only through questions that have scoring rules.
        for (const qId in scoringRules) {
            if (Object.prototype.hasOwnProperty.call(scoringRules, qId)) {
                const answerIndex = answers[qId];
                if (typeof answerIndex === 'number') {
                    const scoreValue = scoringRules[qId][answerIndex];
                    if (typeof scoreValue === 'number') {
                        totalScore += scoreValue;
                    }
                }
            }
        }

        const profile = resultProfiles.find(p => totalScore >= p.minScore && totalScore <= p.maxScore);
        
        if (profile) {
            const newAssessmentData = {
                answers: answers,
                result: { profileKey: profile.profileKey, score: totalScore },
                lastCompleted: new Date().toISOString()
            };
            setAssessmentData(newAssessmentData);

            const planTemplate = planTemplates.find(p => p.profile === profile.profileKey);
            if (planTemplate) {
              setSupportPlan({
                ...planTemplate,
                profile: t(`assessment.${profile.profileKey}_name`)
              });
            }
            if (onClose) onClose();
            else setCurrentView('assessment');
        } else {
            throw new Error("Could not determine a profile for the given score.");
        }
    } catch (error) {
        console.error("Error submitting assessment:", error);
        alert(t('assessment.submit_error'));
    } finally {
        setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLTextAreaElement) return;

      if ((event.key === 'Enter' || event.key === ' ') && isCurrentQuestionAnswered()) {
        event.preventDefault();
        if (currentStep < totalSteps - 1) {
          handleNext();
        } else if (canSubmit) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, answers, questions, canSubmit]);

  if (totalSteps === 0) {
      return (
         <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="text-center p-8 text-white">Loading assessment...</div>
         </div>
      );
  }

  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const WizardContent = (
    <>
      <div className="absolute top-4 right-4 z-20">
        {isInitialOnboarding ? (
          <button onClick={() => setShowSkipConfirm(true)} className="text-shade-2 hover:text-shade-1 font-semibold py-1 px-2 rounded-lg hover:bg-black/10 transition-colors">{t('common.skip_for_now')}</button>
        ) : (
          <button 
              onClick={handleClose} 
              className="text-shade-2 hover:text-shade-1 text-3xl"
              aria-label={t('common.close')}
          >
              &times;
          </button>
        )}
      </div>

      <Card className="p-4 sm:p-6 bg-slate-50/95 flex flex-col">
        <h2 className="text-2xl font-bold text-shade-1 mb-2 text-center mt-6">{t('assessment.title')}</h2>
        <p className="text-shade-2 text-center mb-4">{isPremium ? t('assessment.description_premium') : t('assessment.description')}</p>
        
        <div className="w-full mb-4">
            <div className="w-full bg-shade-1/10 rounded-full h-2">
                <div className="bg-shade-2 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-xs text-center text-shade-2 mt-1">{t('assessment.progress', { current: currentStep + 1, total: totalSteps })}</p>
        </div>
        
        <div className="pt-2 flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-shade-1 text-center flex items-center justify-center">{t(currentQuestion.textKey)}</h3>
            
            <div className="min-h-[160px]">
                {currentQuestion.type === 'textarea' ? (
                     <textarea
                        value={(answers[currentQuestion.id] as string) || ''}
                        onChange={e => handleAnswer(currentQuestion.id, e.target.value)}
                        className="w-full h-32 p-3 border border-shade-2/50 rounded-lg bg-shade-1/10 focus:ring-2 focus:ring-shade-2 focus:outline-none text-shade-1 placeholder-shade-2/80"
                        placeholder={t(currentQuestion.placeholderKey!)}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.from({ length: currentQuestion.optionsCount! }).map((_, index) => (
                        <Button 
                            key={index}
                            variant={answers[currentQuestion.id] === index ? 'primary' : 'secondary'}
                            onClick={() => handleAnswer(currentQuestion.id, index)}
                            className="text-left !justify-start h-full"
                        >
                            {t(`${currentQuestion.optionsKey!}${index + 1}`)}
                        </Button>
                    ))}
                    </div>
                )}
            </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0 || isLoading}>{t('common.back')}</Button>

            <div className="flex items-center gap-2">
                {currentStep < totalSteps - 1 && (
                    <Button onClick={handleNext} disabled={!isCurrentQuestionAnswered()}>
                        {t('common.next')}
                    </Button>
                )}

                {currentStep === totalSteps - 1 && (
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !canSubmit}
                        title={!canSubmit ? t('assessment.all_required_info') : undefined}
                    >
                        {isLoading ? t('assessment.submit_loading') : t('common.finish')}
                    </Button>
                )}
            </div>
        </div>
      </Card>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {WizardContent}
        <Modal
          isOpen={showSkipConfirm}
          onClose={() => setShowSkipConfirm(false)}
          title={t('assessment.skip_confirm_title')}
          className="!bg-slate-50/95"
        >
          <div className="text-center">
              <p className="text-shade-1 mb-6">{t('assessment.skip_confirm_message')}</p>
              <div className="flex justify-center gap-4">
                  <Button variant="ghost" onClick={() => setShowSkipConfirm(false)}>
                      {t('assessment.skip_confirm_cancel')}
                  </Button>
                  <Button variant="primary" onClick={handleClose}>
                      {t('assessment.skip_confirm_confirm')}
                  </Button>
              </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AssessmentWizard;