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
import { History, ArrowUpDown, Loader2 } from 'lucide-react';

type SortOrder = 'desc' | 'asc';

export default function HistoryPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
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