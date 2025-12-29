export type ConversionType =
  | "image_to_text"
  | "image_translate"
  | "jpg_to_word"
  | "jpg_to_excel"
  | "pdf_to_excel"
  | "batch";

export interface Conversion {
  id: string;
  user_id: string;
  type: ConversionType;
  input_filename: string;
  input_format: string;
  output_text: string;
  language: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: "free" | "basic" | "pro" | "enterprise";
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  user_id: string | null;
  rating: number;
  feedback: string | null;
  page: string;
  created_at: string;
}

// SQL to create these tables in Supabase:
/*
-- Create conversions table
CREATE TABLE conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  input_filename TEXT NOT NULL,
  input_format TEXT NOT NULL,
  output_text TEXT NOT NULL,
  language TEXT DEFAULT 'eng',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  page TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own conversions" ON conversions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversions" ON conversions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversions" ON conversions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert ratings" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view ratings" ON ratings FOR SELECT USING (true);

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/
