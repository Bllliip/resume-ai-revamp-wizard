import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Card } from '@/components/ui/card';
import { Check, Target, FileText, TrendingUp, User, Search, Sparkles } from 'lucide-react';

interface NavigationProps {
  onStartImprovement: () => void;
}

export const Navigation = ({ onStartImprovement }: NavigationProps) => {
  const [activeSection, setActiveSection] = useState<'home' | 'features' | 'pricing'>('home');

  const scrollToSection = (section: 'home' | 'features' | 'pricing') => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AI Resume Improver</span>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger 
                  className="text-foreground hover:text-primary"
                  onClick={() => scrollToSection('features')}
                >
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[600px]">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <Target className="w-4 h-4" />
                          <span className="font-semibold">Targeted Optimization</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Customized improvements based on your target role and industry
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <FileText className="w-4 h-4" />
                          <span className="font-semibold">Professional Format</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Industry-standard formatting and structure optimization
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-semibold">Impact Enhancement</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Strengthen your achievements with powerful, results-driven language
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <User className="w-4 h-4" />
                          <span className="font-semibold">Job Tailoring</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Match your resume to specific job descriptions and requirements
                        </p>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Button 
                  variant="ghost" 
                  onClick={() => scrollToSection('pricing')}
                  className="text-foreground hover:text-primary"
                >
                  Pricing
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Log In
            </Button>
            <Button 
              onClick={onStartImprovement}
              className="bg-gradient-primary text-primary-foreground hover:shadow-medium"
            >
              Create My Resume
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};