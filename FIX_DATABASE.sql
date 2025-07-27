-- Fix existing users table by adding missing columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create verification_attempts table if it doesn't exist
CREATE TABLE IF NOT EXISTS verification_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  attempt_type VARCHAR(20) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_email ON verification_attempts(email);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_created_at ON verification_attempts(created_at);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Allow insert for registration" ON users;
DROP POLICY IF EXISTS "Allow insert for rate limiting" ON verification_attempts;
DROP POLICY IF EXISTS "Allow select for rate limiting" ON verification_attempts;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Allow insert for registration" ON users
  FOR INSERT WITH CHECK (true);

-- Create policies for verification_attempts table
CREATE POLICY "Allow insert for rate limiting" ON verification_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select for rate limiting" ON verification_attempts
  FOR SELECT USING (true); 