// components/analytics/GoogleAnalytics.tsx
'use client';

import Script from 'next/script';

/**
 * Google Analytics 4 (GA4) 컴포넌트
 *
 * 사용법:
 * 1. Google Analytics 계정에서 측정 ID 발급 (G-XXXXXXXXXX)
 * 2. .env.local에 NEXT_PUBLIC_GA_MEASUREMENT_ID 추가
 * 3. app/layout.tsx에서 이 컴포넌트 import
 */

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // 측정 ID가 없으면 렌더링하지 않음 (개발 환경에서는 선택사항)
  if (!measurementId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 스크립트 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
