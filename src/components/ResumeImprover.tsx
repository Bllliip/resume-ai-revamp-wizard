import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { WelcomeStep } from './steps/WelcomeStep';
import { QuestionnaireStep } from './steps/QuestionnaireStep';
import { ResumeInputStep } from './steps/ResumeInputStep';
import { ProcessingStep } from './steps/ProcessingStep';
import { ResultsStep } from './steps/ResultsStep';

export interface UserData {
  targetRole: string;
  industry: string;
  experienceLevel: string;
  keySkills: string[];
  careerGoals: string;
  originalResume: string;
  apiKey?: string;
}

export interface BaseStepProps {
  userData: Partial<UserData>;
  updateUserData: (data: Partial<UserData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep?: (stepIndex: number) => void;
  currentStep: number;
  totalSteps: number;
  improvedResume: string;
  setImprovedResume: (resume: string) => void;
}

export const ResumeImprover = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [improvedResume, setImprovedResume] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const steps = [
    { id: 'welcome', component: WelcomeStep },
    { id: 'questionnaire', component: QuestionnaireStep },
    { id: 'resume-input', component: ResumeInputStep },
    { id: 'processing', component: ProcessingStep },
    { id: 'results', component: ResultsStep },
  ];

  const nextStep = () => {
    // If trying to go past welcome step and user is not authenticated, redirect to auth
    if (currentStep === 0 && !user) {
      navigate('/auth');
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen">
      <CurrentStepComponent
        userData={userData}
        updateUserData={updateUserData}
        nextStep={nextStep}
        prevStep={prevStep}
        goToStep={goToStep}
        currentStep={currentStep}
        totalSteps={steps.length}
        improvedResume={improvedResume}
        setImprovedResume={setImprovedResume}
      />
    </div>
  );
};