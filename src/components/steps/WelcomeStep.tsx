import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Sparkles, Target, TrendingUp } from 'lucide-react';

import { BaseStepProps } from '../ResumeImprover';

interface WelcomeStepProps extends Partial<BaseStepProps> {
  nextStep: () => void;
}

export const WelcomeStep = ({ nextStep }: WelcomeStepProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            AI Resume Improver
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your resume with AI-powered optimization. Get personalized improvements
            that help you stand out to employers and land your dream job.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center bg-gradient-card shadow-soft border-0">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-light rounded-xl mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Targeted Optimization</h3>
            <p className="text-muted-foreground text-sm">
              Customized improvements based on your target role and industry
            </p>
          </Card>

          <Card className="p-6 text-center bg-gradient-card shadow-soft border-0">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-light rounded-xl mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Professional Format</h3>
            <p className="text-muted-foreground text-sm">
              Industry-standard formatting and structure optimization
            </p>
          </Card>

          <Card className="p-6 text-center bg-gradient-card shadow-soft border-0">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-light rounded-xl mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Impact Enhancement</h3>
            <p className="text-muted-foreground text-sm">
              Strengthen your achievements with powerful, results-driven language
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={nextStep}
            size="lg"
            className="px-8 py-6 text-lg font-semibold bg-gradient-primary shadow-medium hover:shadow-strong transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started - Improve My Resume
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Takes 5 minutes • Completely free • No signup required
          </p>
        </div>
      </div>
    </div>
  );
};