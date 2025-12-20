// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 환경 설정
  environment: process.env.NODE_ENV || 'development',

  // 샘플링 레이트
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.1,

  // 디버그 모드
  debug: process.env.NODE_ENV === 'development',

  // 민감한 데이터 필터링
  beforeSend(event, hint) {
    // 개발 환경에서는 Sentry로 전송하지 않음
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry server event (dev):', event);
      return null;
    }

    // API 키, 토큰 등 민감한 정보 제거
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
      delete event.request.headers['x-api-key'];
    }

    // 환경 변수에서 민감한 정보 제거
    if (event.contexts?.runtime?.env) {
      const env = event.contexts.runtime.env as Record<string, unknown>;
      Object.keys(env).forEach(key => {
        if (
          key.includes('SECRET') ||
          key.includes('KEY') ||
          key.includes('TOKEN') ||
          key.includes('PASSWORD')
        ) {
          env[key] = '[REDACTED]';
        }
      });
    }

    return event;
  },

  // 무시할 에러들
  ignoreErrors: [
    // Firebase 일시적 에러
    'auth/network-request-failed',
    'auth/too-many-requests',
    // Paddle 일시적 에러
    'paddle_error',
  ],
});
