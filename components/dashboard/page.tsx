// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // 로딩이 끝났는데 사용자가 없으면 로그인 페이지로
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  if (!user) {
    return null; // 리다이렉트 중
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        {t('dashboard.home.greeting', { name: user.displayName || t('common.name') })}
      </h1>
      <div className="space-y-2 text-gray-600">
        <p>
          <span className="font-medium">{t('dashboard.page.userId')}:</span> {user.uid}
        </p>
        <p>
          <span className="font-medium">{t('common.email')}:</span> {user.email}
        </p>
        <p>
          <span className="font-medium">{t('dashboard.page.emailVerified')}:</span>{' '}
          {user.emailVerified ? t('dashboard.page.yes') : t('dashboard.page.no')}
        </p>
      </div>
    </div>
  );
}