import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onStartImprovement: () => void;
}

export const PricingSection = ({ onStartImprovement }: PricingSectionProps) => {
  return (
    <section id="pricing" className="py-20 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground">
            Start for free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <Card className="p-8 bg-gradient-card border border-border shadow-soft">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
              <div className="text-4xl font-bold text-primary mb-2">$0</div>
              <p className="text-muted-foreground">Perfect to get started</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">1 resume generation per month</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Basic AI optimization</span>
              </li>
            </ul>
            
            <Button 
              onClick={onStartImprovement}
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Get Started Free
            </Button>
          </Card>

          {/* Pro Monthly Plan */}
          <Card className="p-8 bg-gradient-card border-2 border-primary shadow-medium relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro Monthly</h3>
              <div className="text-4xl font-bold text-primary mb-2">$20</div>
              <p className="text-muted-foreground">per month</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Unlimited resume generations</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Advanced AI optimization</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Job description tailoring</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Multiple resume templates</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Priority support</span>
              </li>
            </ul>
            
            <Button 
              onClick={onStartImprovement}
              className="w-full bg-gradient-primary text-primary-foreground hover:shadow-strong"
            >
              Start Pro Monthly
            </Button>
          </Card>

          {/* Pro Yearly Plan */}
          <Card className="p-8 bg-gradient-card border border-border shadow-soft">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro Yearly</h3>
              <div className="text-4xl font-bold text-primary mb-2">$60</div>
              <p className="text-muted-foreground">per year</p>
              <div className="mt-2">
                <span className="bg-success/20 text-success px-2 py-1 rounded text-sm font-semibold">
                  Save 75%
                </span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Everything in Pro Monthly</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Massive savings ($180 value)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Early access to new features</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-success" />
                <span className="text-foreground">Premium support</span>
              </li>
            </ul>
            
            <Button 
              onClick={onStartImprovement}
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Start Pro Yearly
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};