import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Sparkles, Target, TrendingUp, Check, User, Search } from 'lucide-react';

import { BaseStepProps } from '../ResumeImprover';

interface WelcomeStepProps extends Partial<BaseStepProps> {
  nextStep: () => void;
}

export const WelcomeStep = ({ nextStep }: WelcomeStepProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="flex items-center justify-center p-6 min-h-screen">
        <div className="max-w-4xl w-full">
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

      {/* Resume Tailoring Section */}
      <div className="bg-card py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold text-foreground">
                Resume tailoring based on the job you're applying for
              </h2>
              <p className="text-lg text-muted-foreground">
                Quickly ensure that your resume covers key skills and experiences by pasting the job ad you're applying for
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Skills and experience section analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Actionable checklist of what else to add to your resume</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Instant comparison between your resume and the job posting</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-card p-8 rounded-lg border border-border shadow-soft">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <FileText className="w-5 h-5" />
                    Job Description Analysis
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">React</span>
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">TypeScript</span>
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Node.js</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grammar Check Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="bg-gradient-card p-8 rounded-lg border border-border shadow-soft">
                <div className="space-y-4">
                  <div className="text-primary font-semibold">Grammar & Spelling Check</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground line-through">impoved</span>
                      <span className="text-success">improved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <span className="text-foreground">Did you mean "improved"?</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <h2 className="text-4xl font-bold text-foreground">
                Check your resume for grammatical and punctuation errors
              </h2>
              <p className="text-lg text-muted-foreground">
                A built-in content checker tool helping you stay on top of grammar errors and clichés
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Wording and readability analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Real-time spelling and grammar corrections</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Professional language suggestions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ATS Optimization Section */}
      <div className="bg-card py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Resumes optimized for applicant tracking systems (ATS)
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our resumes and improvements are rigorously tested against major ATS systems to ensure complete parsability
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">ATS-friendly professionally designed resumes</h3>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Change the font, color and background combinations</h3>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Two-column, single-column, and multi-page layouts</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Trusted by Executives & Senior Professionals
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              <div className="text-primary">⭐⭐⭐⭐⭐</div>
              <span className="text-foreground font-semibold">4.5 Rating</span>
            </div>
            <p className="text-muted-foreground">4,662 happy customers shared their experience.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-card p-6 rounded-lg border border-border shadow-soft">
              <div className="mb-4">
                <div className="text-primary">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-foreground mb-4">
                "I transformed my wife's boring resume into a professional and interesting resume using one of the templates. She was hired within weeks at the first job she applied for."
              </p>
              <p className="text-muted-foreground">— Michael Mendoza</p>
            </div>
            
            <div className="bg-gradient-card p-6 rounded-lg border border-border shadow-soft">
              <div className="mb-4">
                <div className="text-primary">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-foreground mb-4">
                "Great resume tool: easy to use, user friendly, has a lot of templates, allows to make adjustments, move section/blocks, very convenient. Excellent and responsive service."
              </p>
              <p className="text-muted-foreground">— Jennie</p>
            </div>
            
            <div className="bg-gradient-card p-6 rounded-lg border border-border shadow-soft">
              <div className="mb-4">
                <div className="text-primary">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-foreground mb-4">
                "I used AI Resume Improver to create a resume that got recruiters attention. One of the areas that stood out was the ability to customize my resume to the position I was after."
              </p>
              <p className="text-muted-foreground">— Brett Wilson</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-primary py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-primary-foreground">
            Ready to improve your resume and get hired?
          </h2>
          <p className="text-xl text-primary-foreground/80">
            Join thousands of professionals who have landed their dream jobs with our AI-powered resume improvements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={nextStep}
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4"
            >
              Start Improving Your Resume
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};