import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, RefreshCw, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditableCV } from '../EditableCV';

import { BaseStepProps } from '../ResumeImprover';

interface ResultsStepProps extends Partial<BaseStepProps> {
  userData: Partial<any>;
  improvedResume: string;
  prevStep: () => void;
  goToStep?: (stepIndex: number) => void;
}

export const ResultsStep = ({ userData, improvedResume, prevStep, goToStep }: ResultsStepProps) => {
  const [activeTab, setActiveTab] = useState('improved');
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Resume content has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const improvements = [
    'Enhanced action verbs and impact statements',
    'Improved ATS (Applicant Tracking System) compatibility',
    'Strengthened professional summary',
    'Optimized skills section for target role',
    'Better formatting and structure',
    'Industry-specific language improvements'
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => {
              // Go directly to welcome step (landing page)
              goToStep?.(0);
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Start
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-2xl mb-4">
            <CheckCircle className="w-8 h-8 text-success-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Resume Improved!</h1>
          <p className="text-xl text-muted-foreground">
            Your resume has been enhanced with AI-powered optimizations
          </p>
        </div>

        {/* Improvements Overview */}
        <Card className="p-6 mb-8 bg-gradient-card shadow-soft border-0">
          <h3 className="text-lg font-semibold mb-4">Key Improvements Made:</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {improvements.map((improvement, index) => (
              <Badge key={index} variant="secondary" className="p-2 justify-start">
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                {improvement}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Enhanced CV Editor */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-card shadow-medium border-0 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Professional Resume Editor</h3>
                <p className="text-muted-foreground">Edit your resume and download as DOCX or PDF</p>
              </div>
              <Badge className="bg-success text-success-foreground">
                ✨ AI Enhanced & Editable
              </Badge>
            </div>
          </Card>
          
          <EditableCV initialResume={improvedResume} userData={userData} />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => {
              // Go directly to questionnaire step (where you select your data)
              goToStep?.(1);
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </Button>
          <Button
            variant="outline"
            onClick={() => copyToClipboard(improvedResume)}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Original Text
          </Button>
        </div>

        {/* Tips */}
        <Card className="mt-8 p-6 bg-accent border-0">
          <h4 className="font-semibold mb-3">💡 Pro Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• <strong>Edit Mode:</strong> Click "Edit Resume" to customize any section of your resume</li>
            <li>• <strong>DOCX Format:</strong> Best for ATS systems and further editing in Word</li>
            <li>• <strong>PDF Format:</strong> Perfect for email attachments and online applications</li>
            <li>• <strong>Customization:</strong> Tailor the resume further for specific job applications</li>
            <li>• <strong>Review:</strong> Always proofread the final version before submitting</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};