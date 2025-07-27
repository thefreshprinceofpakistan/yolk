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

-- Create conversations table for messaging
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, buyer_id, seller_id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_listings_exchange_type ON listings(exchange_type);
CREATE INDEX idx_listings_location ON listings(location);
CREATE INDEX idx_listings_date_posted ON listings(date_posted);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_conversations_listing_id ON conversations(listing_id);
CREATE INDEX idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller_id ON conversations(seller_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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

-- Create policies for conversations
CREATE POLICY "Users can view conversations they're part of" ON conversations
  FOR SELECT USING (
    auth.uid()::text = buyer_id::text OR 
    auth.uid()::text = seller_id::text
  );

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update conversations they're part of" ON conversations
  FOR UPDATE USING (
    auth.uid()::text = buyer_id::text OR 
    auth.uid()::text = seller_id::text
  );

-- Create policies for messages
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.buyer_id::text = auth.uid()::text OR conversations.seller_id::text = auth.uid()::text)
    )
  );

CREATE POLICY "Users can send messages in their conversations" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.buyer_id::text = auth.uid()::text OR conversations.seller_id::text = auth.uid()::text)
    )
  ); 