'use client';

import { useLanguage } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';

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

export default function MenuDisplay({ restaurant, categories, menuItems }: MenuDisplayProps) {
  const { t } = useLanguage();

  // Group menu items by category
  const itemsByCategory = menuItems.reduce((acc, item) => {
    const categoryId = item.category_id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {restaurant.name}
            </h1>
            <LanguageSwitcher />
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
                      <div className="flex justify-between items-start">
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
                        <div className="ml-4 flex-shrink-0">
                          <span className="text-lg font-semibold text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
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
                        <div className="flex justify-between items-start">
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
                          <div className="ml-4 flex-shrink-0">
                            <span className="text-lg font-semibold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
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

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>{t('poweredBy')}</p>
      </div>
    </div>
  );
}
