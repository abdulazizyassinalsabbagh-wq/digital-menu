-- Digital Menu App Database Schema
-- Run this in your Supabase SQL Editor

-- Restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- Used in URL (e.g., /menu/restaurant-name)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
CREATE INDEX idx_restaurants_slug ON restaurants(slug);

-- Enable Row Level Security (optional, for future multi-tenant support)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access for menu viewing
CREATE POLICY "Allow public read access to restaurants" ON restaurants
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to menu items" ON menu_items
  FOR SELECT USING (true);

-- Analytics table for tracking QR scans and menu views
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'qr_scan', 'menu_view', 'item_added'
  event_data JSONB, -- Additional data like item_id, user_agent, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX idx_analytics_restaurant ON analytics_events(restaurant_id);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);

-- Enable RLS for analytics
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public insert for tracking (customers can track their visits)
CREATE POLICY "Allow public insert to analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Allow restaurant owners to read their own analytics
CREATE POLICY "Allow public read access to analytics" ON analytics_events
  FOR SELECT USING (true);
