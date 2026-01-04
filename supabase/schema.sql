-- Image to Text SaaS Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. User Profiles Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. Conversions History Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT, -- 'image', 'pdf'
  file_size INTEGER, -- in bytes
  extracted_text TEXT,
  character_count INTEGER,
  language TEXT DEFAULT 'auto',
  tool_used TEXT DEFAULT 'ocr', -- 'ocr', 'translator', 'pdf-to-text', etc.
  processing_time INTEGER, -- in milliseconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON public.conversions(created_at DESC);

-- =============================================
-- 3. Daily Usage Tracking Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  conversion_count INTEGER DEFAULT 0,
  total_characters INTEGER DEFAULT 0,
  total_file_size BIGINT DEFAULT 0, -- in bytes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON public.usage(user_id, date);

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_characters INTEGER DEFAULT 0,
  p_file_size INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.usage (user_id, date, conversion_count, total_characters, total_file_size)
  VALUES (p_user_id, CURRENT_DATE, 1, p_characters, p_file_size)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    conversion_count = public.usage.conversion_count + 1,
    total_characters = public.usage.total_characters + p_characters,
    total_file_size = public.usage.total_file_size + p_file_size,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. API Keys Table (for Pro/Enterprise users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL, -- Store hashed API key
  name TEXT DEFAULT 'Default',
  last_used_at TIMESTAMPTZ,
  requests_today INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);

-- =============================================
-- 5. Feedback/Ratings Table
-- =============================================
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page TEXT NOT NULL, -- 'home', 'batch', 'pdf-to-text', etc.
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Conversions: Users can CRUD their own conversions
CREATE POLICY "Users can view own conversions" ON public.conversions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversions" ON public.conversions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversions" ON public.conversions
  FOR DELETE USING (auth.uid() = user_id);

-- Usage: Users can view their own usage
CREATE POLICY "Users can view own usage" ON public.usage
  FOR SELECT USING (auth.uid() = user_id);

-- API Keys: Users can manage their own keys
CREATE POLICY "Users can view own api keys" ON public.api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api keys" ON public.api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api keys" ON public.api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Ratings: Anyone can insert, users can view their own
CREATE POLICY "Anyone can insert ratings" ON public.ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own ratings" ON public.ratings
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- =============================================
-- Plan Limits Configuration
-- =============================================
-- Use this to check limits in your app:
-- free: 10 conversions/day, 5MB file size, 3 batch files
-- basic: 100 conversions/day, 20MB file size, 10 batch files
-- pro: 500 conversions/day, 50MB file size, 50 batch files
-- enterprise: unlimited

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
