// sentry.edge.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 환경 설정
  environment: process.env.NODE_ENV || 'development',

  // 샘플링 레이트
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.1,

  // 디버그 모드
  debug: process.env.NODE_ENV === 'development',

  // Edge runtime에서는 제한된 integrations만 사용 가능
  beforeSend(event) {
    // 개발 환경에서는 Sentry로 전송하지 않음
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry edge event (dev):', event);
      return null;
    }

    return event;
  },
});
