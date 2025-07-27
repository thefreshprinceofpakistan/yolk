-- Setup Database for Eggconomy
-- Run this in your Supabase SQL Editor

-- Create users table with all required columns
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_expires TIMESTAMP WITH TIME ZONE,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_attempts table for rate limiting
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

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;

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

-- Insert some sample data (optional)
-- INSERT INTO users (name, email, password, email_verified) VALUES 
-- ('Test User', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS8sK.', true); 