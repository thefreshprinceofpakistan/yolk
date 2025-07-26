-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  exchange_type VARCHAR(50) NOT NULL CHECK (exchange_type IN ('gift', 'barter', 'cash', 'hybrid')),
  location VARCHAR(255) NOT NULL,
  notes TEXT,
  date_posted DATE NOT NULL DEFAULT CURRENT_DATE,
  barter_for TEXT,
  suggested_cash VARCHAR(100),
  payment_handles JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_listings_exchange_type ON listings(exchange_type);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_date_posted ON listings(date_posted);
CREATE INDEX idx_users_name ON users(name);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to listings
CREATE POLICY "Listings are viewable by everyone" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create listings" ON listings
  FOR INSERT WITH CHECK (true);

-- Create policies for user management
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can create users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text); 