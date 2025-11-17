// app/test-language/page.tsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher, { LanguageSwitcherDropdown } from '@/components/LanguageSwitcher';

/**
 * 언어 전환 테스트 페이지
 * 
 * URL: http://localhost:3000/test-language
 * 
 * 테스트 방법:
 * 1. ?lang=ko 로 접속 → 한글로 표시되어야 함
 * 2. ?lang=en 로 접속 → 영어로 표시되어야 함
 * 3. 언어 전환 버튼 클릭 → 즉시 전환되어야 함
 * 4. 페이지 새로고침 → 선택한 언어 유지되어야 함
 */
export default function TestLanguagePage() {
  const { t, locale, isKorean, isEnglish } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              🌍 {isKorean ? '다국어 지원 테스트' : 'Multi-language Test'}
            </h1>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <LanguageSwitcherDropdown />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-blue-800">
              <strong>Current Locale:</strong> {locale} ({isKorean ? '한국어' : 'English'})
            </p>
            <p className="text-sm text-blue-800 mt-2">
              <strong>Test URLs:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• <code>?lang=ko</code> → Korean</li>
              <li>• <code>?lang=en</code> → English</li>
            </ul>
          </div>
        </div>

        {/* 인증 섹션 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{t('common.or')} Auth Section</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold">{t('auth.login.title')}</p>
              <p className="text-sm text-gray-600">{t('auth.login.subtitle')}</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold">{t('auth.signup.title')}</p>
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {t('auth.signup.signupButton')}
              </button>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-semibold">{t('auth.forgotPassword.title')}</p>
              <p className="text-sm text-gray-600">{t('auth.forgotPassword.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* 대시보드 섹션 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{t('dashboard.sidebar.dashboard')}</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">{t('dashboard.home.stats.monthlyUsage')}</p>
              <p className="text-3xl font-bold text-blue-600">
                {t('dashboard.home.stats.count', { count: 42 })}
              </p>
              <p className="text-xs text-gray-500 mt-1">{t('dashboard.home.stats.monthlyUsageDesc')}</p>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600 mb-1">{t('dashboard.home.stats.totalSummaries')}</p>
              <p className="text-3xl font-bold text-green-600">1,234</p>
              <p className="text-xs text-gray-500 mt-1">{t('dashboard.home.stats.totalSummariesDesc')}</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded text-white">
            <h3 className="font-bold mb-2">{t('dashboard.home.upgrade.title')}</h3>
            <p className="text-sm mb-3">{t('dashboard.home.upgrade.description')}</p>
            <button className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-50">
              {t('dashboard.home.upgrade.viewPro')}
            </button>
          </div>
        </div>

        {/* 구독 섹션 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{t('subscription.title')}</h2>
          
          <div className="space-y-4">
            <div className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{t('subscription.free.title')}</h3>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {t('subscription.free.badge')}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{t('subscription.free.description')}</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>{t('subscription.free.limitation1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>{t('subscription.free.limitation2')}</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-blue-500 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{t('subscription.pro.title')}</h3>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                  {t('subscription.pro.active')}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{t('subscription.pro.description')}</p>
              <button className="w-full px-4 py-2 border rounded hover:bg-gray-50">
                {t('subscription.pro.updatePayment')}
              </button>
            </div>
          </div>
        </div>

        {/* 마케팅 섹션 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">{t('marketing.header.features')}</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">{t('marketing.features.aiSummary.title')}</h3>
              <p className="text-sm text-gray-600">{t('marketing.features.aiSummary.description')}</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">{t('marketing.features.smartQA.title')}</h3>
              <p className="text-sm text-gray-600">{t('marketing.features.smartQA.description')}</p>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-bold mb-2">{t('marketing.features.koreanSupport.title')}</h3>
              <p className="text-sm text-gray-600">{t('marketing.features.koreanSupport.description')}</p>
            </div>
          </div>
        </div>

        {/* 공통 요소 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Common Elements</h2>
          
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {t('common.save')}
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              {t('common.cancel')}
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              {t('common.delete')}
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              {t('common.confirm')}
            </button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-sm">
              <strong>{t('common.loading')}</strong> - {t('common.error')} - {t('common.success')}
            </p>
          </div>
        </div>

        {/* 테스트 정보 */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-bold text-yellow-900 mb-2">✅ Test Checklist</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>□ URL에 ?lang=ko 추가 → 한글로 표시</li>
            <li>□ URL에 ?lang=en 추가 → 영어로 표시</li>
            <li>□ 버튼으로 언어 전환 → 즉시 변경</li>
            <li>□ 페이지 새로고침 → 언어 유지</li>
            <li>□ localStorage에 'summarygenie_locale' 저장 확인</li>
          </ul>
        </div>
      </div>
    </div>
  );
}