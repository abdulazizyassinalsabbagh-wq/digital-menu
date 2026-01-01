import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import MenuDisplay from '@/components/MenuDisplay';
import { LanguageProvider } from '@/components/LanguageProvider';

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

async function getRestaurantData(slug: string) {
  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !restaurant) {
    return null;
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('display_order', { ascending: true });

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .order('display_order', { ascending: true });

  return {
    restaurant: restaurant as Restaurant,
    categories: categories as Category[] || [],
    menuItems: menuItems as MenuItem[] || [],
  };
}

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getRestaurantData(slug);

  if (!data) {
    notFound();
  }

  const { restaurant, categories, menuItems } = data;

  return (
    <LanguageProvider>
      <MenuDisplay
        restaurant={restaurant}
        categories={categories}
        menuItems={menuItems}
      />
    </LanguageProvider>
  );
}
