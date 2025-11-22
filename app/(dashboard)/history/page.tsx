// app/(dashboard)/history/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/hooks/useHistory';
import { HistoryDocument } from '@/lib/firebase/types';
import HistoryTable from '@/components/dashboard/HistoryTable';
import HistoryModal from '@/components/dashboard/HistoryModal';
import SearchBar from '@/components/dashboard/SearchBar';
import DomainFilter from '@/components/dashboard/DomainFilter';
import { useTranslation } from '@/hooks/useTranslation';
import { History, ArrowUpDown, Loader2, Lock, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';

type SortOrder = 'desc' | 'asc';

export default function HistoryPage() {
  const { t } = useTranslation();
  const { user, isPremium, loading: authLoading } = useAuth();
  const userId = user?.uid || null;

  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedItem, setSelectedItem] = useState<(HistoryDocument & { id: string }) | null>(null);
  
  const {
    history,
    loading,
    error,
    loadMore,
    hasMore,
    search,
    filterByDomain,
    isLoadingMore,
  } = useHistory(userId, { pageSize: 20 });

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      const timeA = a.createdAt.toMillis();
      const timeB = b.createdAt.toMillis();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [history, sortOrder]);

  const handleSearch = (term: string) => {
    search(term);
  };

  const [selectedDomain, setSelectedDomain] = useState('');
  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    filterByDomain(domain);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

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

  // ✅ 프리미엄이 아닌 경우 업그레이드 안내 UI
  if (!isPremium) {
    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('dashboard.history.title')}
              </h1>
            </div>
          </div>
        </div>

        {/* 프리미엄 전용 안내 카드 */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 border-2 border-blue-200 shadow-lg">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {/* 아이콘 */}
            <div className="flex items-center justify-center space-x-2">
              <div className="relative">
                <Crown className="w-16 h-16 text-yellow-500" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>

            {/* 제목 */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t('dashboard.history.premiumOnly.title')}
                </h2>
              </div>
              <p className="text-lg text-gray-600">
                {t('dashboard.history.premiumOnly.subtitle')}
              </p>
            </div>

            {/* 혜택 */}
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('dashboard.history.premiumOnly.benefitsTitle')}
              </h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {t('dashboard.history.premiumOnly.benefit1')}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {t('dashboard.history.premiumOnly.benefit2')}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {t('dashboard.history.premiumOnly.benefit3')}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {t('dashboard.history.premiumOnly.benefit4')}
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA 버튼 */}
            <div className="space-y-4">
              <Link
                href="/subscription"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Crown className="w-5 h-5" />
                <span>{t('dashboard.history.premiumOnly.upgradeButton')}</span>
              </Link>
              
              <p className="text-sm text-gray-500">
                {t('dashboard.history.premiumOnly.footer')}
              </p>
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {t('dashboard.history.premiumOnly.feature1Title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('dashboard.history.premiumOnly.feature1Desc')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {t('dashboard.history.premiumOnly.feature2Title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('dashboard.history.premiumOnly.feature2Desc')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {t('dashboard.history.premiumOnly.feature3Title')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('dashboard.history.premiumOnly.feature3Desc')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 프리미엄 사용자는 기존 로직 그대로
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="w-8 h-8 text-blue-600" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {t('dashboard.history.title')}
              </h1>
              {/* Pro 배지 */}
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full">
                PRO
              </span>
            </div>
            {!loading && (
              <p className="text-gray-600 mt-1">
                {t('dashboard.history.totalCount', { count: history.length })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 필터 & 검색 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 검색 */}
          <div className="md:col-span-2">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* 도메인 필터 */}
          <DomainFilter
            history={history}
            selectedDomain={selectedDomain}
            onDomainChange={handleDomainChange}
          />
        </div>

        {/* 정렬 버튼 */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={toggleSort}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>
              {sortOrder === 'desc' ? t('dashboard.history.sortNewest') : t('dashboard.history.sortOldest')}
            </span>
          </button>

          <div className="text-sm text-gray-500">
            {selectedDomain && (
              <span>
                {t('dashboard.history.filtering', { domain: selectedDomain })}
              </span>
            )}
            {t('dashboard.history.perPage')}
          </div>
        </div>
      </div>

      {/* 에러 상태 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            {t('common.error')}: {error.message}
          </p>
        </div>
      )}

      {/* 히스토리 테이블 */}
      <HistoryTable
        history={sortedHistory}
        onView={setSelectedItem}
        loading={loading}
      />

      {/* 더 보기 버튼 */}
      {hasMore && !loading && (
        <div className="py-8 text-center">
          {isLoadingMore ? (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('dashboard.history.loadingMore')}</span>
            </div>
          ) : (
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('dashboard.history.loadMore')}
            </button>
          )}
        </div>
      )}

      {/* 끝 표시 */}
      {!loading && !hasMore && history.length > 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          {t('dashboard.history.allLoaded')}
        </div>
      )}

      {/* 상세 모달 */}
      <HistoryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}