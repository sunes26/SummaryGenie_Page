// components/dashboard/RecentHistory.tsx
'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { ko } from 'date-fns/locale/ko';
import { enUS } from 'date-fns/locale/en-US';
import { FileText, ExternalLink, ArrowRight, Crown, Lock, Sparkles } from 'lucide-react';
import { HistoryDocument } from '@/lib/firebase/types';
import { useTranslation } from '@/hooks/useTranslation';

interface RecentHistoryProps {
  history: (HistoryDocument & { id: string })[];
  loading?: boolean;
  isPremium?: boolean;
}

export default function RecentHistory({
  history,
  loading = false,
  isPremium = false,
}: RecentHistoryProps) {
  const { t, locale } = useTranslation();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3 rounded-lg animate-pulse"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ✅ 프리미엄이 아닌 경우 Pro 전용 UI 표시
  if (!isPremium) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('dashboard.home.stats.recentWeek')}
          </h3>
        </div>

        {/* Pro 전용 안내 */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-blue-100">
          <div className="text-center space-y-4">
            {/* 아이콘 */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <Crown className="w-12 h-12 text-yellow-500" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>

            {/* 제목 */}
            <div className="space-y-1">
              <div className="flex items-center justify-center space-x-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <h4 className="text-lg font-bold text-gray-900">
                  {t('dashboard.history.premiumOnly.title')}
                </h4>
              </div>
              <p className="text-sm text-gray-600">
                {t('dashboard.history.premiumOnly.subtitle')}
              </p>
            </div>

            {/* 혜택 미리보기 */}
            <div className="bg-white/80 backdrop-blur rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {t('dashboard.history.premiumOnly.benefitsTitle')}
              </p>
              <ul className="space-y-1.5 text-left text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {t('dashboard.history.premiumOnly.benefit1')}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {t('dashboard.history.premiumOnly.benefit2')}
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA 버튼 */}
            <Link
              href="/subscription"
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md text-sm"
            >
              <Crown className="w-4 h-4" />
              <span>{t('dashboard.history.premiumOnly.upgradeButton')}</span>
            </Link>

            <p className="text-xs text-gray-500">
              {t('dashboard.history.premiumOnly.footer')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 프리미엄 사용자 - 기존 로직
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.home.stats.recentWeek')}
        </h3>
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">{t('dashboard.history.empty')}</p>
          <p className="text-sm text-gray-400">
            {t('dashboard.history.emptyDesc')}
          </p>
        </div>
      </div>
    );
  }

  const dateLocale = locale === 'ko' ? ko : enUS;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('dashboard.home.stats.recentWeek')}
          </h3>
          {/* Pro 배지 */}
          <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full">
            PRO
          </span>
        </div>
        <Link
          href="/history"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
        >
          <span>{locale === 'ko' ? '전체보기' : 'View All'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-2">
        {history.slice(0, 5).map((item) => {
          const timeAgo = formatDistanceToNow(item.createdAt.toDate(), {
            addSuffix: true,
            locale: dateLocale,
          });

          return (
            <div
              key={item.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate mb-1 group-hover:text-blue-600 transition">
                  {item.title || t('dashboard.modal.title')}
                </h4>

                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{timeAgo}</span>
                  {item.metadata?.domain && (
                    <>
                      <span>•</span>
                      <span className="truncate">
                        {item.metadata.domain}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {history.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href="/history"
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {locale === 'ko' 
              ? `${history.length - 5}개 더보기` 
              : `View ${history.length - 5} more`}
          </Link>
        </div>
      )}
    </div>
  );
}