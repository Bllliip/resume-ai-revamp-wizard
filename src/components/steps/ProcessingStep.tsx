import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { UserData, BaseStepProps } from '../ResumeImprover';
import { Sparkles, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProcessingStepProps extends Partial<BaseStepProps> {
  userData: Partial<UserData>;
  nextStep: () => void;
  setImprovedResume: (resume: string) => void;
  goToStep?: (stepIndex: number) => void;
}

interface UsageStatus {
  success: boolean;
  current_usage: number;
  limit: number;
  tier: string;
  message: string;
}

const processingSteps = [
  { label: 'Analyzing your resume structure', duration: 2000 },
  { label: 'Identifying improvement opportunities', duration: 3000 },
  { label: 'Enhancing content and formatting', duration: 4000 },
  { label: 'Optimizing for ATS systems', duration: 2000 },
  { label: 'Generating final improvements', duration: 3000 },
];

export const ProcessingStep = ({ userData, nextStep, setImprovedResume, goToStep }: ProcessingStepProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [usageLimitExceeded, setUsageLimitExceeded] = useState(false);
  const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const processResume = async () => {
      try {
        // First check usage limits
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Check if user can use the service
        const { data: usageData, error: usageError } = await supabase
          .rpc('increment_usage', { user_uuid: user.id });

        if (usageError) {
          console.error('Usage check error:', usageError);
          throw new Error('Failed to check usage limits');
        }

        const typedUsageData = usageData as unknown as UsageStatus;
        if (!typedUsageData.success) {
          setUsageStatus(typedUsageData);
          setUsageLimitExceeded(true);
          toast({
            title: "Usage Limit Reached",
            description: `You've used ${typedUsageData.current_usage}/${typedUsageData.limit} resume improvements this month on the ${typedUsageData.tier} plan.`,
            variant: "destructive",
          });
          return;
        }

        // Simulate processing steps
        for (let i = 0; i < processingSteps.length; i++) {
          setCurrentStepIndex(i);
          const stepProgress = ((i + 1) / processingSteps.length) * 100;
          setProgress(stepProgress);
          
          // If this is the last step, make the actual API call
          if (i === processingSteps.length - 1) {
            try {
              const { data, error } = await supabase.functions.invoke('improve-resume', {
                body: {
                  resume: userData.originalResume || '',
                  targetRole: userData.targetRole || '',
                  industry: userData.industry || '',
                  experienceLevel: userData.experienceLevel || '',
                  keySkills: userData.keySkills || [],
                  careerGoals: userData.careerGoals || '',
                  mode: 'rewrite',
                  preserveStructure: true
                }
              });

              if (error) {
                console.error('Resume improvement error:', error);
                throw error;
              }

              if (data?.improved_resume) {
                setImprovedResume(data.improved_resume);
                if (data.warnings && data.warnings.length > 0) {
                  console.warn('Resume improvement warnings:', data.warnings);
                }
              } else {
                throw new Error('No improved resume returned from API');
              }
            } catch (apiError) {
              console.error('API call failed:', apiError);
              // Fallback to original resume with a note
              const fallbackMessage = `${userData.originalResume || ''}\n\n[Note: Resume improvement service is currently unavailable. Please try again later.]`;
              setImprovedResume(fallbackMessage);
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, processingSteps[i].duration));
        }
        
        setIsComplete(true);
        setTimeout(() => {
          nextStep();
        }, 1500);
      } catch (error) {
        console.error('Processing error:', error);
        setImprovedResume(`${userData.originalResume}\n\n[Note: Resume improvement service encountered an error. Please try again later.]`);
        setIsComplete(true);
        setTimeout(() => {
          nextStep();
        }, 1500);
      }
    };

    processResume();
  }, [userData, nextStep, setImprovedResume, toast]);


  const handleUpgrade = async (planType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan_type: planType }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (usageLimitExceeded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <Card className="p-8 bg-gradient-card shadow-medium border-0 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive rounded-2xl mb-6">
                <AlertCircle className="w-10 h-10 text-destructive-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Usage Limit Reached
              </h2>
              <p className="text-muted-foreground mb-4">
                You've used {usageStatus?.current_usage}/{usageStatus?.limit} resume improvements this month on the {usageStatus?.tier} plan.
              </p>
              <p className="text-sm text-muted-foreground">
                Upgrade to a premium plan to get 100 resume improvements per month, or wait until next month to use the free tier again.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleUpgrade('monthly')}
                  className="bg-gradient-primary text-primary-foreground hover:shadow-strong"
                >
                  Upgrade to Monthly ($20/month)
                </Button>
                <Button 
                  onClick={() => handleUpgrade('yearly')}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Upgrade to Yearly ($40/year)
                </Button>
              </div>
              <Button 
                onClick={() => goToStep?.(0)}
                variant="ghost"
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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