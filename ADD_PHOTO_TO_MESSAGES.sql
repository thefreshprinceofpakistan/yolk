-- Add photo_url column to messages table
-- Run this in your Supabase SQL Editor

-- Add photo_url column to existing messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add a comment to explain the column
COMMENT ON COLUMN messages.photo_url IS 'URL or data URL of photo attached to message'; 