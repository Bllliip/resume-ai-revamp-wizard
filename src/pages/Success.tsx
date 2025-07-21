import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [subscriptionUpdated, setSubscriptionUpdated] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Check subscription status to update the database
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.error('Error checking subscription:', error);
          toast({
            title: "Verification Warning",
            description: "Payment successful, but subscription verification failed. Please refresh or contact support.",
            variant: "destructive",
          });
        } else {
          setSubscriptionUpdated(true);
          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated. You can now use premium features.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Verification Error",
          description: "Unable to verify payment. Please contact support if issues persist.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [toast]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-hero">
      <div className="max-w-2xl w-full">
        <Card className="p-8 bg-gradient-card shadow-medium border-0 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success rounded-2xl mb-6">
              {isVerifying ? (
                <Loader2 className="w-10 h-10 text-success-foreground animate-spin" />
              ) : (
                <CheckCircle className="w-10 h-10 text-success-foreground" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {isVerifying ? 'Verifying Payment...' : 'Payment Successful!'}
            </h2>
            <p className="text-muted-foreground">
              {isVerifying 
                ? 'Please wait while we verify your payment and activate your subscription.'
                : subscriptionUpdated 
                  ? 'Your subscription has been activated and you now have access to premium features including 100 resume improvements per month.'
                  : 'Payment was successful. Your subscription should be active shortly.'
              }
            </p>
          </div>

          {!isVerifying && (
            <div className="space-y-4">
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <h3 className="font-semibold text-success mb-2">What's Next?</h3>
                <ul className="text-sm text-success/80 space-y-1">
                  <li>• You can now generate up to 100 resumes per month</li>
                  <li>• Access to advanced AI optimization features</li>
                  <li>• Priority customer support</li>
                  <li>• Job description tailoring capabilities</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-primary text-primary-foreground hover:shadow-strong"
              >
                Continue to Resume Improver
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Success;