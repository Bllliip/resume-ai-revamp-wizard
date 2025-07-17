import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResumeImprover } from '@/components/ResumeImprover';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate('/auth');
        } else {
          setUser(session.user);
        }
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (!user) return null; // Prevent flashing content

  return (
    <div className="min-h-screen bg-gradient-hero">
      <ResumeImprover />
    </div>
  );
};

export default Index;