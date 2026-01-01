'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { supabase } from '@/lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
}

interface MenuDisplayProps {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
}

interface OrderItem extends MenuItem {
  quantity: number;
}

export default function MenuDisplay({ restaurant, categories, menuItems }: MenuDisplayProps) {
  const { t } = useLanguage();
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [showOrderList, setShowOrderList] = useState(false);

  // Track menu view when component mounts
  useEffect(() => {
    const trackMenuView = async () => {
      try {
        await supabase.from('analytics_events').insert({
          restaurant_id: restaurant.id,
          event_type: 'menu_view',
          event_data: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackMenuView();
  }, [restaurant.id]);

  // Group menu items by category
  const itemsByCategory = menuItems.reduce((acc, item) => {
    const categoryId = item.category_id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const addToOrder = (item: MenuItem) => {
    setOrderList((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (itemId: string) => {
    setOrderList((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(itemId);
    } else {
      setOrderList((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  };

  const getTotalPrice = () => {
    return orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return orderList.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setShowOrderList(!showOrderList)}
                className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <span>🛒</span>
                <span className="font-medium">Order List</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-2">{t('ourMenu')}</p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {menuItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              {t('menuComingSoon')}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Uncategorized items first */}
            {itemsByCategory['uncategorized'] && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">{t('menuItems')}</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {itemsByCategory['uncategorized'].map((item) => (
                    <div key={item.id} className="px-6 py-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            {!item.is_available && (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                {t('soldOut')}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-gray-900">
                            €{item.price.toFixed(2)}
                          </span>
                          {item.is_available && (
                            <button
                              onClick={() => addToOrder(item)}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
                            >
                              + Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categorized items */}
            {categories.map((category) => {
              const items = itemsByCategory[category.id];
              if (!items || items.length === 0) return null;

              return (
                <div key={category.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <div key={item.id} className="px-6 py-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                              {!item.is_available && (
                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                                  {t('soldOut')}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold text-gray-900">
                              €{item.price.toFixed(2)}
                            </span>
                            {item.is_available && (
                              <button
                                onClick={() => addToOrder(item)}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order List Modal */}
      {showOrderList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-t-lg sm:rounded-lg max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">Your Order List</h2>
              <button
                onClick={() => setShowOrderList(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {orderList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Your order list is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add items from the menu to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderList.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">€{item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                        >
                          −
                        </button>
                        <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right min-w-[4rem]">
                        <p className="font-semibold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => removeFromOrder(item.id)}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {orderList.length > 0 && (
              <div className="border-t p-6 bg-white sticky bottom-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-700">Total ({getTotalItems()} items):</span>
                  <span className="text-2xl font-bold text-gray-900">€{getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setOrderList([])}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>{t('poweredBy')}</p>
      </div>
    </div>
  );
}
