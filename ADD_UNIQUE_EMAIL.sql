-- Add unique constraint on email to prevent duplicate accounts
-- Run this in your Supabase SQL Editor

-- Add unique constraint on email column (only for non-null emails)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email IS NOT NULL;

-- Also add a unique constraint on name to prevent duplicate usernames
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_name_unique ON users(name);

-- Optional: Add a comment to explain the constraint
COMMENT ON INDEX idx_users_email_unique IS 'Ensures each email can only be used for one account';
COMMENT ON INDEX idx_users_name_unique IS 'Ensures each username is unique'; 