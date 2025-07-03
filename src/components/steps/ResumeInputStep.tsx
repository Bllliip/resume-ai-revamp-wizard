import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserData, BaseStepProps } from '../ResumeImprover';
import { ChevronLeft, ChevronRight, Upload, FileText } from 'lucide-react';

interface ResumeInputStepProps extends Partial<BaseStepProps> {
  userData: Partial<UserData>;
  updateUserData: (data: Partial<UserData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const ResumeInputStep = ({ userData, updateUserData, nextStep, prevStep }: ResumeInputStepProps) => {
  const [resumeText, setResumeText] = useState(userData.originalResume || '');

  const handleSubmit = () => {
    updateUserData({ originalResume: resumeText });
    nextStep();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const isValid = resumeText.trim().length > 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <Card className="p-8 bg-gradient-card shadow-medium border-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Upload Your Current Resume</h2>
            <p className="text-muted-foreground">
              Paste your resume text below or upload a text file. Our AI will analyze and improve it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="resume" className="text-base font-medium">Resume Content *</Label>
              <Textarea
                id="resume"
                placeholder="Paste your complete resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="mt-2 min-h-[400px] font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {resumeText.length} characters • Minimum 100 characters required
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-light rounded-xl mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Text File</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Upload a .txt file of your resume
                </p>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Choose File
                </Button>
              </div>

              <div className="bg-accent p-6 rounded-lg">
                <h4 className="font-semibold mb-3">💡 Tips for Best Results:</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Include complete contact information</li>
                  <li>• List all work experience with dates</li>
                  <li>• Include education and certifications</li>
                  <li>• Add skills and technical abilities</li>
                  <li>• Include achievements and metrics where possible</li>
                </ul>
              </div>

              <div className="bg-primary-light p-6 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">🔒 Privacy & Security</h4>
                <p className="text-sm text-primary">
                  Your resume data is processed securely and not stored permanently. 
                  We only use it to generate improvements during your session.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isValid}
              className="flex items-center gap-2 bg-gradient-primary"
            >
              Improve My Resume
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};