'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/components/LanguageProvider';

interface AnalyticsData {
  totalViews: number;
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
  viewsByDay: { date: string; count: number }[];
  topViewHours: { hour: number; count: number }[];
}

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    viewsToday: 0,
    viewsThisWeek: 0,
    viewsThisMonth: 0,
    viewsByDay: [],
    topViewHours: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const restaurantId = localStorage.getItem('restaurantId');
    if (!restaurantId) return;

    try {
      // Get all analytics events
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('event_type', 'menu_view')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (events) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calculate metrics
        const totalViews = events.length;
        const viewsToday = events.filter(
          (e) => new Date(e.created_at) >= today
        ).length;
        const viewsThisWeek = events.filter(
          (e) => new Date(e.created_at) >= weekAgo
        ).length;
        const viewsThisMonth = events.filter(
          (e) => new Date(e.created_at) >= monthAgo
        ).length;

        // Group by day for last 7 days
        const viewsByDay = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
          const dateStr = date.toISOString().split('T')[0];
          const count = events.filter((e) => {
            const eventDate = new Date(e.created_at).toISOString().split('T')[0];
            return eventDate === dateStr;
          }).length;
          return {
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            count,
          };
        }).reverse();

        // Group by hour of day
        const hourCounts = new Array(24).fill(0);
        events.forEach((e) => {
          const hour = new Date(e.created_at).getHours();
          hourCounts[hour]++;
        });
        const topViewHours = hourCounts
          .map((count, hour) => ({ hour, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setAnalytics({
          totalViews,
          viewsToday,
          viewsThisWeek,
          viewsThisMonth,
          viewsByDay,
          topViewHours,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('analytics')}</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Views */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('totalViews')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalViews}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <span className="text-2xl">👁️</span>
            </div>
          </div>
        </div>

        {/* Today's Views */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('viewsToday')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.viewsToday}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('viewsThisWeek')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.viewsThisWeek}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('viewsThisMonth')}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.viewsThisMonth}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views by Day */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('viewsLast7Days')}</h3>
          <div className="space-y-3">
            {analytics.viewsByDay.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">{day.date}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.max((day.count / Math.max(...analytics.viewsByDay.map((d) => d.count))) * 100, 5)}%`,
                    }}
                  >
                    <span className="text-xs font-medium text-white">{day.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top View Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('peakHours')}</h3>
          <div className="space-y-3">
            {analytics.topViewHours.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {item.hour.toString().padStart(2, '0')}:00 - {(item.hour + 1).toString().padStart(2, '0')}:00
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{item.count} views</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(item.count / analytics.topViewHours[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 {t('aboutAnalytics')}</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• {t('analyticsInfo1')}</li>
          <li>• {t('analyticsInfo2')}</li>
          <li>• {t('analyticsInfo3')}</li>
        </ul>
      </div>
    </div>
  );
}
