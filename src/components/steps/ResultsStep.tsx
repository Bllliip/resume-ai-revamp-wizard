import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, RefreshCw, FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

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

  const downloadAsDocx = async (content: string, filename: string) => {
    try {
      // Parse the resume content into sections
      const lines = content.split('\n').filter(line => line.trim() !== '');
      const paragraphs = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if this line looks like a heading (all caps, short, or has common heading patterns)
        const isHeading = line.length < 50 && (
          line === line.toUpperCase() || 
          line.includes('SUMMARY') || 
          line.includes('EXPERIENCE') || 
          line.includes('EDUCATION') || 
          line.includes('SKILLS') || 
          line.includes('CONTACT') ||
          line.includes('PROFILE') ||
          line.includes('OBJECTIVE') ||
          line.includes('QUALIFICATIONS') ||
          line.includes('ACHIEVEMENTS') ||
          line.includes('CERTIFICATIONS') ||
          line.includes('PROJECTS')
        );
        
        if (isHeading) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: {
                after: 200,
                before: 200,
              },
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 22,
                }),
              ],
              spacing: {
                after: 120,
              },
            })
          );
        }
      }
      
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });
      
      const buffer = await Packer.toBlob(doc);
      const element = document.createElement('a');
      element.href = URL.createObjectURL(buffer);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: "Download successful",
        description: "Resume downloaded as .docx file",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again or copy the text manually",
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
      <div className="max-w-6xl mx-auto">
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
                  onClick={() => downloadAsDocx(
                    activeTab === 'improved' ? improvedResume : userData.originalResume || '',
                    activeTab === 'improved' ? 'improved-resume.docx' : 'original-resume.docx'
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
            onClick={() => {
              // Go directly to questionnaire step (where you select your data)
              goToStep?.(1);
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Make Changes
          </Button>
          <Button
            onClick={() => downloadAsDocx(improvedResume, 'improved-resume.docx')}
            className="flex items-center gap-2 bg-gradient-primary"
          >
            <Download className="w-4 h-4" />
            Download Improved Resume (.docx)
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