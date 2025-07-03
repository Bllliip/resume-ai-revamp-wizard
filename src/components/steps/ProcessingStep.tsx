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
        
        // If this is the last step, make the API call
        if (i === processingSteps.length - 1) {
          try {
            await improveResumeWithAI();
          } catch (error) {
            console.error('Error improving resume:', error);
            // Fallback to demo content
            setImprovedResume(generateDemoImprovedResume());
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, processingSteps[i].duration));
      }
      
      setIsComplete(true);
      setTimeout(() => {
        nextStep();
      }, 1500);
    };

    processResume();
  }, []);

  const improveResumeWithAI = async () => {
    const prompt = `You are a professional resume improvement expert. Please improve the following resume for someone targeting a ${userData.targetRole} role in the ${userData.industry} industry with ${userData.experienceLevel} experience level.

Key skills to highlight: ${userData.keySkills?.join(', ')}
Career goals: ${userData.careerGoals}

Original Resume:
${userData.originalResume}

Please provide an improved version that:
1. Uses strong action verbs and quantifiable achievements
2. Is optimized for ATS (Applicant Tracking Systems)
3. Has clear, professional formatting
4. Highlights relevant skills and experience
5. Uses industry-appropriate language
6. Improves the overall structure and flow

Return only the improved resume content, no additional commentary.`;

    const response = await fetch('/functions/v1/improve-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        targetRole: userData.targetRole,
        industry: userData.industry,
        experienceLevel: userData.experienceLevel,
        keySkills: userData.keySkills,
        careerGoals: userData.careerGoals,
        originalResume: userData.originalResume
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to improve resume');
    }

    const data = await response.json();
    const improvedContent = data.improvedResume || '';
    setImprovedResume(improvedContent);
  };

  const generateDemoImprovedResume = () => {
    return `[Demo Improved Resume - API Error Fallback]

JOHN DOE
Senior Software Engineer | Full-Stack Developer
📧 john.doe@email.com | 📱 (555) 123-4567 | 🌐 linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Expertise in React, Node.js, and cloud technologies. Proven track record of delivering high-quality software solutions that drive business growth and improve user experience.

TECHNICAL SKILLS
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Redux
• Backend: Node.js, Python, Express.js, RESTful APIs, GraphQL
• Databases: PostgreSQL, MongoDB, Redis
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD pipelines
• Tools: Git, Jest, Jenkins, Jira, Agile/Scrum methodologies

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2020 - Present
• Led development of customer-facing web application serving 100K+ users, resulting in 25% increase in user engagement
• Architected and implemented microservices architecture, reducing deployment time by 40%
• Mentored 3 junior developers and conducted code reviews to maintain high code quality standards
• Collaborated with product managers and designers to deliver features aligned with business objectives

Software Engineer | Digital Solutions Ltd. | 2017 - 2020
• Developed and maintained e-commerce platform handling $2M+ in annual transactions
• Optimized database queries resulting in 50% improvement in page load times
• Implemented automated testing suite achieving 85% code coverage
• Participated in agile development process and sprint planning sessions

EDUCATION
Bachelor of Science in Computer Science | State University | 2017
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems

CERTIFICATIONS
• AWS Certified Solutions Architect - Associate (2021)
• Certified Scrum Master (CSM) (2020)

This is a demo version. Please provide a valid OpenAI API key for personalized improvements.`;
  };

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