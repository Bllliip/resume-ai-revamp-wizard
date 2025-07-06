import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UserData, BaseStepProps } from '../ResumeImprover';
import { Sparkles, CheckCircle, Loader2 } from 'lucide-react';

interface ProcessingStepProps extends Partial<BaseStepProps> {
  userData: Partial<UserData>;
  nextStep: () => void;
  setImprovedResume: (resume: string) => void;
}

const processingSteps = [
  { label: 'Analyzing your resume structure', duration: 2000 },
  { label: 'Identifying improvement opportunities', duration: 3000 },
  { label: 'Enhancing content and formatting', duration: 4000 },
  { label: 'Optimizing for ATS systems', duration: 2000 },
  { label: 'Generating final improvements', duration: 3000 },
];

export const ProcessingStep = ({ userData, nextStep, setImprovedResume }: ProcessingStepProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const processResume = async () => {
      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStepIndex(i);
        const stepProgress = ((i + 1) / processingSteps.length) * 100;
        setProgress(stepProgress);
        
        await new Promise(resolve => setTimeout(resolve, processingSteps[i].duration));
      }
      
      setIsComplete(true);
      setTimeout(() => {
        nextStep();
      }, 1500);
    };

    processResume();
  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="p-8 bg-gradient-card shadow-medium border-0 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6">
              {isComplete ? (
                <CheckCircle className="w-10 h-10 text-primary-foreground" />
              ) : (
                <Sparkles className="w-10 h-10 text-primary-foreground animate-pulse" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {isComplete ? 'Resume Improved!' : 'Improving Your Resume'}
            </h2>
            <p className="text-muted-foreground">
              {isComplete 
                ? 'Your resume has been successfully optimized with AI-powered improvements.'
                : 'Our AI is analyzing and enhancing your resume with professional optimizations.'
              }
            </p>
          </div>

          <div className="space-y-6">
            <Progress value={progress} className="w-full h-3" />
            
            <div className="space-y-4">
              {processingSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    index < currentStepIndex ? 'bg-success-light text-success' :
                    index === currentStepIndex ? 'bg-primary-light text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : index === currentStepIndex ? (
                    <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-current flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
              ))}
            </div>

            {isComplete && (
              <div className="mt-6 p-4 bg-success-light rounded-lg">
                <p className="text-success font-medium">
                  ✨ All improvements complete! Redirecting to results...
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};