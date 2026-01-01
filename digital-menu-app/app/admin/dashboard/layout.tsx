'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LanguageProvider, useLanguage } from '@/components/LanguageProvider';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [restaurantName, setRestaurantName] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is logged in
    const restaurantId = localStorage.getItem('restaurantId');
    const name = localStorage.getItem('restaurantName');

    if (!restaurantId) {
      router.push('/admin/login');
    } else {
      setRestaurantName(name || 'Restaurant');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('restaurantId');
    localStorage.removeItem('restaurantName');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {restaurantName} - {t('dashboard')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('menuItemsAdmin')}
              </Link>
              <Link
                href="/admin/dashboard/categories"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('categories')}
              </Link>
              <Link
                href="/admin/dashboard/analytics"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('analytics')}
              </Link>
              <Link
                href="/admin/dashboard/qr-code"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('qrCode')}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <DashboardContent>{children}</DashboardContent>
    </LanguageProvider>
  );
}
