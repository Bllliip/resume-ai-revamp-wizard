import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, RefreshCw, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { BaseStepProps } from '../ResumeImprover';

interface ResultsStepProps extends Partial<BaseStepProps> {
  userData: Partial<any>;
  improvedResume: string;
  prevStep: () => void;
}

export const ResultsStep = ({ userData, improvedResume, prevStep }: ResultsStepProps) => {
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

  const downloadAsText = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
      <div className="max-w-6xl mx-auto">
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

        {/* Resume Comparison */}
        <Card className="p-6 bg-gradient-card shadow-medium border-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="improved" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Improved Resume
                </TabsTrigger>
                <TabsTrigger value="original" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Original Resume
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(activeTab === 'improved' ? improvedResume : userData.originalResume || '')}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadAsText(
                    activeTab === 'improved' ? improvedResume : userData.originalResume || '',
                    activeTab === 'improved' ? 'improved-resume.txt' : 'original-resume.txt'
                  )}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </div>

            <TabsContent value="improved" className="mt-0">
              <div className="bg-background p-6 rounded-lg border min-h-[600px]">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-success text-success-foreground">
                    ✨ AI Enhanced
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Optimized for {userData.targetRole} in {userData.industry}
                  </span>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {improvedResume || 'Processing...'}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="original" className="mt-0">
              <div className="bg-background p-6 rounded-lg border min-h-[600px]">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">
                    📄 Original Version
                  </Badge>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {userData.originalResume || 'No original resume available'}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Make Changes
          </Button>
          <Button
            onClick={() => downloadAsText(improvedResume, 'improved-resume.txt')}
            className="flex items-center gap-2 bg-gradient-primary"
          >
            <Download className="w-4 h-4" />
            Download Improved Resume
          </Button>
        </div>

        {/* Tips */}
        <Card className="mt-8 p-6 bg-accent border-0">
          <h4 className="font-semibold mb-3">💡 Next Steps:</h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Review and customize the improved content to match your personal voice</li>
            <li>• Update any specific details that need personalization</li>
            <li>• Format the resume in your preferred document editor (Word, Google Docs, etc.)</li>
            <li>• Tailor the resume further for specific job applications</li>
            <li>• Consider having a friend or mentor review the final version</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};