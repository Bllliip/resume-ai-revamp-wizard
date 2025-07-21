-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  usage_count INTEGER NOT NULL DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create policies for usage tracking
CREATE POLICY "select_own_usage" ON public.usage_tracking
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "update_own_usage" ON public.usage_tracking
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "insert_own_usage" ON public.usage_tracking
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Function to update usage count
CREATE OR REPLACE FUNCTION public.increment_usage(user_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_month TEXT;
  current_usage INTEGER;
  user_tier TEXT;
  tier_limit INTEGER;
  result JSONB;
BEGIN
  -- Get current month in YYYY-MM format
  current_month := to_char(CURRENT_DATE, 'YYYY-MM');
  
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM public.subscribers 
  WHERE user_id = user_uuid AND subscribed = true
  ORDER BY updated_at DESC 
  LIMIT 1;
  
  -- Default to free if no subscription found
  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;
  
  -- Set usage limits based on tier
  CASE user_tier
    WHEN 'premium' THEN tier_limit := 100;
    WHEN 'yearly' THEN tier_limit := 100;
    ELSE tier_limit := 1; -- free tier
  END CASE;
  
  -- Get or create usage record for current month
  INSERT INTO public.usage_tracking (user_id, month_year, usage_count, subscription_tier)
  VALUES (user_uuid, current_month, 0, user_tier)
  ON CONFLICT (user_id, month_year) 
  DO UPDATE SET 
    subscription_tier = user_tier,
    updated_at = now();
  
  -- Get current usage
  SELECT usage_count INTO current_usage
  FROM public.usage_tracking
  WHERE user_id = user_uuid AND month_year = current_month;
  
  -- Check if user has exceeded limit
  IF current_usage >= tier_limit THEN
    result := jsonb_build_object(
      'success', false,
      'current_usage', current_usage,
      'limit', tier_limit,
      'tier', user_tier,
      'message', 'Usage limit exceeded for this month'
    );
  ELSE
    -- Increment usage count
    UPDATE public.usage_tracking 
    SET usage_count = usage_count + 1,
        updated_at = now()
    WHERE user_id = user_uuid AND month_year = current_month;
    
    result := jsonb_build_object(
      'success', true,
      'current_usage', current_usage + 1,
      'limit', tier_limit,
      'tier', user_tier,
      'message', 'Usage incremented successfully'
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Function to get current usage status
CREATE OR REPLACE FUNCTION public.get_usage_status(user_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_month TEXT;
  current_usage INTEGER;
  user_tier TEXT;
  tier_limit INTEGER;
  result JSONB;
BEGIN
  -- Get current month in YYYY-MM format
  current_month := to_char(CURRENT_DATE, 'YYYY-MM');
  
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM public.subscribers 
  WHERE user_id = user_uuid AND subscribed = true
  ORDER BY updated_at DESC 
  LIMIT 1;
  
  -- Default to free if no subscription found
  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;
  
  -- Set usage limits based on tier
  CASE user_tier
    WHEN 'premium' THEN tier_limit := 100;
    WHEN 'yearly' THEN tier_limit := 100;
    ELSE tier_limit := 1; -- free tier
  END CASE;
  
  -- Get current usage (default to 0 if no record exists)
  SELECT COALESCE(usage_count, 0) INTO current_usage
  FROM public.usage_tracking
  WHERE user_id = user_uuid AND month_year = current_month;
  
  IF current_usage IS NULL THEN
    current_usage := 0;
  END IF;
  
  result := jsonb_build_object(
    'current_usage', current_usage,
    'limit', tier_limit,
    'tier', user_tier,
    'can_use', current_usage < tier_limit,
    'remaining', tier_limit - current_usage
  );
  
  RETURN result;
END;
$$;