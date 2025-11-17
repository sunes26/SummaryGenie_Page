// components/LanguageSwitcher.tsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Locale, getLocaleName, getLocaleFlag } from '@/lib/language';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * 언어 전환 버튼 컴포넌트
 * 
 * @example
 * ```tsx
 * <LanguageSwitcher />
 * ```
 */
export default function LanguageSwitcher({ 
  className = '', 
  showLabel = true 
}: LanguageSwitcherProps) {
  const { locale, setLocale, isKorean, isEnglish } = useTranslation();

  const handleToggle = () => {
    const newLocale: Locale = isKorean ? 'en' : 'ko';
    setLocale(newLocale);
    
    // 페이지 새로고침 (선택사항)
    // window.location.reload();
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
      aria-label="Change language"
    >
      <Globe className="w-4 h-4" />
      {showLabel && (
        <>
          <span className="text-sm font-medium">
            {getLocaleFlag(locale)} {getLocaleName(locale)}
          </span>
          <span className="text-xs text-gray-500">
            → {getLocaleFlag(isKorean ? 'en' : 'ko')}
          </span>
        </>
      )}
    </button>
  );
}

/**
 * 드롭다운 스타일 언어 전환기
 */
export function LanguageSwitcherDropdown({ className = '' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  const languages: Locale[] = ['ko', 'en'];

  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="px-3 py-2 pr-8 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors appearance-none cursor-pointer text-sm font-medium"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {getLocaleFlag(lang)} {getLocaleName(lang)}
          </option>
        ))}
      </select>
      
      {/* 드롭다운 아이콘 */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}