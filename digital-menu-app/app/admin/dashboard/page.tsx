'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/components/LanguageProvider';

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
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_available: true,
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    const restaurantId = localStorage.getItem('restaurantId');
    if (!restaurantId) return;

    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setMenuItems(data);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const restaurantId = localStorage.getItem('restaurantId');
    if (!restaurantId) return;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const restaurantId = localStorage.getItem('restaurantId');
    if (!restaurantId) return;

    const itemData = {
      restaurant_id: restaurantId,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: formData.category_id || null,
      is_available: formData.is_available,
    };

    if (editingItem) {
      // Update existing item
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id);

      if (!error) {
        fetchMenuItems();
        resetForm();
      }
    } else {
      // Add new item
      const { error } = await supabase.from('menu_items').insert(itemData);

      if (!error) {
        fetchMenuItems();
        resetForm();
      }
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id || '',
      is_available: item.is_available,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    const { error } = await supabase.from('menu_items').delete().eq('id', id);

    if (!error) {
      fetchMenuItems();
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id);

    if (!error) {
      fetchMenuItems();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_available: true,
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return t('uncategorized');
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || t('uncategorized');
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('menuItemsAdmin')}</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showAddForm ? t('cancel') : t('addNewItem')}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium mb-4">
            {editingItem ? t('editMenuItem') : t('addNewMenuItem')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('description')}</label>
              <textarea
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('price')}</label>
              <input
                type="number"
                step="0.01"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('category')}</label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="">{t('uncategorized')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_available"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              />
              <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">
                {t('available')}
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editingItem ? t('updateItem') : t('addItem')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {menuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('noMenuItems')}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {menuItems.map((item) => (
              <li key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.is_available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.is_available ? t('available') : t('soldOut')}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="font-medium text-gray-900">€{item.price.toFixed(2)}</span>
                      <span className="text-gray-500">{getCategoryName(item.category_id)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm"
                    >
                      {item.is_available ? t('markUnavailable') : t('markAvailable')}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-gray-600 hover:text-gray-800 px-3 py-1 text-sm"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 text-sm"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
