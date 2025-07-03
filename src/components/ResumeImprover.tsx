import { useState } from 'react';
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
  currentStep: number;
  totalSteps: number;
  improvedResume: string;
  setImprovedResume: (resume: string) => void;
}

export const ResumeImprover = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [improvedResume, setImprovedResume] = useState<string>('');

  const steps = [
    { id: 'welcome', component: WelcomeStep },
    { id: 'questionnaire', component: QuestionnaireStep },
    { id: 'resume-input', component: ResumeInputStep },
    { id: 'processing', component: ProcessingStep },
    { id: 'results', component: ResultsStep },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
        currentStep={currentStep}
        totalSteps={steps.length}
        improvedResume={improvedResume}
        setImprovedResume={setImprovedResume}
      />
    </div>
  );
};