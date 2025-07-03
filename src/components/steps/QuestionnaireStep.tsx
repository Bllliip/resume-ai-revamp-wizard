import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserData, BaseStepProps } from '../ResumeImprover';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionnaireStepProps extends Partial<BaseStepProps> {
  userData: Partial<UserData>;
  updateUserData: (data: Partial<UserData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const skillSuggestions = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'AWS', 'Docker',
  'Project Management', 'Leadership', 'Communication', 'Problem Solving', 'Analytics',
  'Marketing', 'Sales', 'Design', 'Data Analysis', 'Machine Learning', 'Agile', 'Scrum'
];

export const QuestionnaireStep = ({ userData, updateUserData, nextStep, prevStep }: QuestionnaireStepProps) => {
  const [formData, setFormData] = useState({
    targetRole: userData.targetRole || '',
    industry: userData.industry || '',
    experienceLevel: userData.experienceLevel || '',
    keySkills: userData.keySkills || [],
    careerGoals: userData.careerGoals || ''
  });

  const addSkill = (skill: string) => {
    if (!formData.keySkills.includes(skill)) {
      const newSkills = [...formData.keySkills, skill];
      setFormData({ ...formData, keySkills: newSkills });
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = formData.keySkills.filter(s => s !== skill);
    setFormData({ ...formData, keySkills: newSkills });
  };

  const handleSubmit = () => {
    updateUserData(formData);
    nextStep();
  };

  const isValid = formData.targetRole && formData.industry && formData.experienceLevel;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="p-8 bg-gradient-card shadow-medium border-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Tell Us About Your Goals</h2>
            <p className="text-muted-foreground">
              Help us understand your career objectives to provide personalized improvements.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="targetRole" className="text-base font-medium">Target Job Role *</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Senior Software Engineer, Marketing Manager"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="industry" className="text-base font-medium">Industry *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your target industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience" className="text-base font-medium">Experience Level *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-7 years)</SelectItem>
                  <SelectItem value="senior">Senior Level (8-15 years)</SelectItem>
                  <SelectItem value="executive">Executive Level (15+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Key Skills</Label>
              <p className="text-sm text-muted-foreground mb-3">Click to add relevant skills:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {skillSuggestions.map((skill) => (
                  <Badge
                    key={skill}
                    variant={formData.keySkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => formData.keySkills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="careerGoals" className="text-base font-medium">Career Goals (Optional)</Label>
              <Textarea
                id="careerGoals"
                placeholder="What are your main career objectives? Any specific companies or roles you're targeting?"
                value={formData.careerGoals}
                onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                className="mt-2"
                rows={3}
              />
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
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};