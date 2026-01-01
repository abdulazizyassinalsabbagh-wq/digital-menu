-- Add INSERT, UPDATE, DELETE policies for admin operations

-- Restaurants table policies
CREATE POLICY "Allow insert to restaurants" ON restaurants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update to restaurants" ON restaurants
  FOR UPDATE USING (true);

-- Categories table policies
CREATE POLICY "Allow insert to categories" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update to categories" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete from categories" ON categories
  FOR DELETE USING (true);

-- Menu items table policies
CREATE POLICY "Allow insert to menu_items" ON menu_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update to menu_items" ON menu_items
  FOR UPDATE USING (true);

CREATE POLICY "Allow delete from menu_items" ON menu_items
  FOR DELETE USING (true);
