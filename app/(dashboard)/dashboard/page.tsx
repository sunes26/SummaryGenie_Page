// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useHistory, useHistoryCount } from '@/hooks/useHistory';
import { useMonthlyUsage, useRecentUsage } from '@/hooks/useUsageStats';
import StatsCard from '@/components/dashboard/StatsCard';
import UsageChart from '@/components/dashboard/UsageChart';
import RecentHistory from '@/components/dashboard/RecentHistory';
import UsageWarningBanner from '@/components/dashboard/UsageWarningBanner';
import { useTranslation } from '@/hooks/useTranslation';
import {
  TrendingUp,
  FileText,
  Calendar,
  Zap,
  Chrome,
  Crown,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, isPremium, loading: authLoading } = useAuth();
  const userId = user?.uid || null;

  const { history, loading: historyLoading } = useHistory(userId, { pageSize: 5 });
  const { count: totalCount, loading: countLoading } = useHistoryCount(userId);
  const { total: monthlyTotal, loading: monthlyLoading, error: monthlyError, dailyStats: monthlyStats } = useMonthlyUsage(userId);
  const { dailyStats, weeklyTotal, loading: statsLoading, error: statsError } = useRecentUsage(userId, 7);

  // ✅ 디버깅: 콘솔에 데이터 출력
  if (userId) {
    console.log('🔍 Dashboard Debug Info:');
    console.log('📧 User ID:', userId);
    console.log('📅 Monthly Stats:', monthlyStats);
    console.log('📊 Daily Stats (7 days):', dailyStats);
    console.log('📈 Monthly Total:', monthlyTotal);
    console.log('📈 Weekly Total:', weeklyTotal);
    console.log('❌ Monthly Error:', monthlyError);
    console.log('❌ Stats Error:', statsError);
  }

  // ✅ 모든 데이터가 로드될 때까지만 로딩 표시
  const isLoading = authLoading || historyLoading || countLoading || monthlyLoading || statsLoading;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('common.error')}
          </h2>
          <p className="text-gray-600">
            {t('auth.login.title')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('dashboard.home.title')}
        </h1>
        <p className="text-gray-600">
          {t('dashboard.home.greeting', { name: user.displayName || t('common.name') })}
        </p>
      </div>

      {/* ✅ 디버깅 패널 (개발 환경에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-2">🔧 디버깅 정보</h3>
          <div className="text-xs font-mono text-yellow-800 space-y-1">
            <p>User ID: {userId}</p>
            <p>Monthly Total: {monthlyTotal} (Loading: {monthlyLoading ? 'Yes' : 'No'})</p>
            <p>Weekly Total: {weeklyTotal} (Loading: {statsLoading ? 'Yes' : 'No'})</p>
            <p>Monthly Stats Count: {monthlyStats?.length || 0}</p>
            <p>Daily Stats Count: {dailyStats?.length || 0}</p>
            {monthlyError && <p className="text-red-600">Monthly Error: {monthlyError.message}</p>}
            {statsError && <p className="text-red-600">Stats Error: {statsError.message}</p>}
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">Raw Data</summary>
              <pre className="mt-2 bg-yellow-100 p-2 rounded overflow-x-auto">
                {JSON.stringify({ monthlyStats, dailyStats }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {/* ✅ 사용량 경고 배너 (무료 사용자만) */}
      {!isPremium && !isLoading && (
        <UsageWarningBanner currentUsage={monthlyTotal} />
      )}

      {/* ✅ 통계 카드 그리드 - 항상 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title={t('dashboard.home.stats.monthlyUsage')}
          value={t('dashboard.home.stats.count', { count: monthlyTotal })}
          icon={Calendar}
          description={t('dashboard.home.stats.monthlyUsageDesc')}
          color="blue"
          loading={isLoading}
        />

        <StatsCard
          title={t('dashboard.home.stats.totalSummaries')}
          value={totalCount}
          icon={FileText}
          description={t('dashboard.home.stats.totalSummariesDesc')}
          color="green"
          loading={isLoading}
        />

        <StatsCard
          title={t('dashboard.home.stats.recentWeek')}
          value={t('dashboard.home.stats.count', { count: weeklyTotal })}
          icon={TrendingUp}
          description={t('dashboard.home.stats.recentWeekDesc')}
          color="purple"
          loading={isLoading}
        />
      </div>

      {/* ✅ 빠른 액션 버튼 (Free 사용자만) */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="w-6 h-6" />
                <h3 className="text-xl font-bold">{t('dashboard.home.upgrade.title')}</h3>
              </div>
              <p className="text-blue-100 mb-4">
                {t('dashboard.home.upgrade.description')}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/subscription"
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {t('dashboard.home.upgrade.viewPro')}
                </a>
                <a
                  href="https://chrome.google.com/webstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition backdrop-blur-sm"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  {t('dashboard.home.upgrade.installExtension')}
                </a>
              </div>
            </div>
            <Zap className="w-16 h-16 text-yellow-300 opacity-50" />
          </div>
        </div>
      )}

      {/* Chrome 확장 프로그램 설치 안내 (Pro 사용자용) */}
      {isPremium && (
        <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Chrome className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  {t('dashboard.home.extension.title')}
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                {t('dashboard.home.extension.description')}
              </p>
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                <Chrome className="w-4 h-4 mr-2" />
                {t('dashboard.home.extension.install')}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 차트와 최근 기록 - 항상 표시 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 7일 사용량 차트 */}
        <UsageChart data={dailyStats} loading={statsLoading} />

        {/* ✅ 최근 요약 5개 - isPremium prop 전달 */}
        <RecentHistory 
          history={history} 
          loading={historyLoading} 
          isPremium={isPremium}
        />
      </div>

      {/* ✅ 도움말 섹션 - 항상 표시 */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          {t('dashboard.home.gettingStarted.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">{t('dashboard.home.gettingStarted.step1Title')}</p>
            <p className="text-blue-700">
              {t('dashboard.home.gettingStarted.step1Desc')}
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">{t('dashboard.home.gettingStarted.step2Title')}</p>
            <p className="text-blue-700">
              {t('dashboard.home.gettingStarted.step2Desc')}
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">{t('dashboard.home.gettingStarted.step3Title')}</p>
            <p className="text-blue-700">
              {t('dashboard.home.gettingStarted.step3Desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}