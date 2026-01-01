'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestMenuPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test restaurants
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('restaurants')
        .select('*');

      if (restaurantsError) {
        setError(`Restaurants error: ${restaurantsError.message}`);
      } else {
        setRestaurants(restaurantsData || []);
      }

      // Test categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        setError((prev) => `${prev}\nCategories error: ${categoriesError.message}`);
      } else {
        setCategories(categoriesData || []);
      }

      // Test menu items
      const { data: menuItemsData, error: menuItemsError } = await supabase
        .from('menu_items')
        .select('*');

      if (menuItemsError) {
        setError((prev) => `${prev}\nMenu Items error: ${menuItemsError.message}`);
      } else {
        setMenuItems(menuItemsData || []);
      }
    } catch (err: any) {
      setError(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Testing Database Connection...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Database Test Results</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
            <h2 className="font-semibold text-red-800 mb-2">Errors:</h2>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        <div className="space-y-6">
          {/* Restaurants */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Restaurants ({restaurants.length})</h2>
            {restaurants.length === 0 ? (
              <p className="text-gray-500">No restaurants found</p>
            ) : (
              <div className="bg-gray-50 rounded p-4">
                {restaurants.map((restaurant) => (
                  <div key={restaurant.id} className="mb-2">
                    <p><strong>Name:</strong> {restaurant.name}</p>
                    <p><strong>Slug:</strong> {restaurant.slug}</p>
                    <p><strong>ID:</strong> {restaurant.id}</p>
                    <a
                      href={`/menu/${restaurant.slug}`}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                    >
                      → Visit menu: /menu/{restaurant.slug}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Categories ({categories.length})</h2>
            {categories.length === 0 ? (
              <p className="text-gray-500">No categories found</p>
            ) : (
              <div className="bg-gray-50 rounded p-4">
                <pre className="text-sm">{JSON.stringify(categories, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Menu Items ({menuItems.length})</h2>
            {menuItems.length === 0 ? (
              <p className="text-gray-500">No menu items found</p>
            ) : (
              <div className="bg-gray-50 rounded p-4">
                <pre className="text-sm">{JSON.stringify(menuItems, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
