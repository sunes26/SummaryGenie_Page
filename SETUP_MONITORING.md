# 🚀 모니터링 시스템 설정 가이드

프로덕션 환경을 위한 완벽한 모니터링 시스템 설정 가이드입니다.

---

## 📋 목차

1. [패키지 설치](#1-패키지-설치)
2. [Sentry 설정](#2-sentry-설정)
3. [Pino 로거 설정](#3-pino-로거-설정)
4. [Slack 알림 설정](#4-slack-알림-설정)
5. [Discord 알림 설정](#5-discord-알림-설정)
6. [UptimeRobot 설정](#6-uptimerobot-설정)
7. [환경 변수 설정](#7-환경-변수-설정)
8. [테스트](#8-테스트)

---

## 1. 패키지 설치

### 필수 패키지 설치

```bash
npm install @sentry/nextjs pino pino-pretty
```

### 패키지 설명

- `@sentry/nextjs`: Next.js용 Sentry SDK (에러 모니터링)
- `pino`: 고성능 Node.js 로거
- `pino-pretty`: 개발 환경용 Pino pretty printer

---

## 2. Sentry 설정

### 2.1. Sentry 계정 생성

1. [Sentry.io](https://sentry.io) 회원가입 (무료 플랜 사용 가능)
2. 새 프로젝트 생성: **Next.js** 선택
3. **DSN** 복사 (예: `https://abc123@o123456.ingest.sentry.io/123456`)

### 2.2. 환경 변수 추가

`.env.local` 파일에 추가:

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
SENTRY_AUTH_TOKEN=your-sentry-auth-token-here  # (선택사항: 소스맵 업로드용)
```

### 2.3. next.config.ts 수정

`next.config.ts` 파일을 다음과 같이 수정:

```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

// ✅ Validate environment variables at build time
import './lib/env';

const nextConfig: NextConfig = {
  // ... 기존 설정 유지 ...
};

// Sentry로 래핑
export default withSentryConfig(nextConfig, {
  // Sentry Webpack Plugin 옵션
  silent: true, // 빌드 로그 억제
  org: 'your-org-name',        // Sentry organization slug
  project: 'your-project-name', // Sentry project name

  // 소스맵 업로드 설정
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
});
```

### 2.4. instrumentation 활성화

`next.config.ts`에 instrumentation 활성화 추가:

```typescript
const nextConfig: NextConfig = {
  // ... 기존 설정 ...

  experimental: {
    // ... 기존 experimental 설정 ...
    instrumentationHook: true,  // ← 추가
  },
};
```

### 2.5. 테스트

Sentry가 제대로 작동하는지 테스트:

```typescript
// app/test-sentry/page.tsx
'use client';

export default function TestSentryPage() {
  return (
    <button onClick={() => {
      throw new Error('Test Sentry Error!');
    }}>
      Test Sentry
    </button>
  );
}
```

버튼 클릭 후 Sentry 대시보드에서 에러 확인

---

## 3. Pino 로거 설정

### 3.1. 기본 설정

이미 `lib/logger.ts`에 설정되어 있습니다. 추가 설정 필요 없음.

### 3.2. 환경 변수 추가

```bash
# 로그 레벨 설정 (개발: debug, 프로덕션: warn)
LOG_LEVEL=warn
```

### 3.3. 사용 예시

```typescript
import { logger } from '@/lib/logger';

// 기본 로깅
logger.info('User logged in');
logger.warn('Rate limit approaching');
logger.error('Payment failed', { userId, amount });

// 구조화된 로깅
logger.info({ userId, action: 'purchase' }, 'Payment completed');

// 에러 로깅
try {
  await riskyOperation();
} catch (error) {
  logger.error({ err: error, userId }, 'Operation failed');
}
```

---

## 4. Slack 알림 설정

### 4.1. Slack Incoming Webhook 생성

1. [Slack API](https://api.slack.com/apps) 접속
2. **Create New App** → **From scratch**
3. 앱 이름 입력 (예: "Gena Monitoring")
4. Workspace 선택
5. **Incoming Webhooks** 활성화
6. **Add New Webhook to Workspace**
7. 알림 받을 채널 선택 (예: `#alerts`)
8. **Webhook URL** 복사

### 4.2. 환경 변수 추가

```bash
# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

### 4.3. 테스트

```typescript
// 테스트 스크립트
import { sendNotification } from '@/lib/notifications';

await sendNotification({
  title: 'Test Notification',
  message: 'This is a test message from Gena',
  severity: 'info',
});
```

---

## 5. Discord 알림 설정

### 5.1. Discord Webhook 생성

1. Discord 서버 열기
2. 알림 받을 채널 선택
3. **채널 설정** → **연동** → **웹후크**
4. **새 웹후크** 생성
5. 웹후크 이름 설정 (예: "Gena Monitoring")
6. **웹후크 URL 복사**

### 5.2. 환경 변수 추가

```bash
# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/123456789/abcdefg...
```

### 5.3. Slack과 Discord 동시 사용

둘 다 설정하면 자동으로 모든 채널에 알림 전송됩니다.

---

## 6. UptimeRobot 설정

### 6.1. UptimeRobot 계정 생성

1. [UptimeRobot](https://uptimerobot.com) 회원가입 (무료 플랜)
2. **Add New Monitor** 클릭

### 6.2. Health Check 모니터 생성

**Monitor Type**: HTTP(s)

**Friendly Name**: Gena Production Health

**URL**: `https://your-domain.com/api/health`

**Monitoring Interval**: 5 minutes (무료 플랜)

**Monitor Timeout**: 30 seconds

**Alert Contacts**: 이메일 또는 Slack/Discord 연동

### 6.3. Slack 연동 (선택사항)

1. UptimeRobot → **My Settings** → **Alert Contacts**
2. **Add Alert Contact**
3. **Alert Contact Type**: Slack
4. Slack Webhook URL 입력

### 6.4. 예상 Health Check 응답

```json
{
  "status": "healthy",
  "timestamp": "2025-12-20T10:30:00.000Z",
  "uptime": 123456,
  "latency": 45,
  "checks": {
    "firestore": { "status": "ok", "latency": 20 },
    "redis": { "status": "ok", "latency": 5 },
    "environment": { "status": "ok" }
  },
  "version": "1.0.0",
  "environment": "production"
}
```

---

## 7. 환경 변수 설정

### 7.1. 전체 환경 변수 목록

`.env.local` (로컬 개발):

```bash
# ==========================================
# Sentry
# ==========================================
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# ==========================================
# 로그 레벨
# ==========================================
LOG_LEVEL=debug  # 개발: debug, 프로덕션: warn

# ==========================================
# Slack 알림
# ==========================================
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# ==========================================
# Discord 알림
# ==========================================
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# ==========================================
# 개발 환경 알림 설정 (선택사항)
# ==========================================
NOTIFICATIONS_IN_DEV=false  # true로 설정하면 개발에서도 알림 전송

# ==========================================
# Cron Job 인증
# ==========================================
CRON_SECRET=your-secure-random-secret-here

# ==========================================
# Paddle IP 화이트리스트 (선택사항)
# ==========================================
PADDLE_ALLOWED_IPS=34.194.127.46,54.234.237.108,52.7.138.208,3.208.120.145

# ==========================================
# 앱 버전 (Health Check에 표시)
# ==========================================
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 7.2. Vercel 환경 변수 설정

1. Vercel 프로젝트 대시보드 열기
2. **Settings** → **Environment Variables**
3. 위의 환경 변수들을 **Production** 환경에 추가
4. **Save** 후 **Redeploy**

---

## 8. 테스트

### 8.1. Health Check 테스트

```bash
# 로컬
curl http://localhost:3000/api/health

# 프로덕션
curl https://your-domain.com/api/health
```

### 8.2. Sentry 테스트

1. 앱에서 의도적으로 에러 발생
2. Sentry 대시보드에서 확인

### 8.3. Slack/Discord 알림 테스트

```bash
# Webhook 재시도 실패를 시뮬레이션하여 알림 테스트
# (실제로는 webhook이 5번 실패해야 알림이 발송됨)
```

또는 직접 테스트:

```typescript
// app/api/test-notification/route.ts
import { NextResponse } from 'next/server';
import { sendNotification } from '@/lib/notifications';

export async function GET() {
  await sendNotification({
    title: '🧪 Test Notification',
    message: 'This is a test notification from Gena',
    severity: 'info',
    metadata: {
      test: true,
      timestamp: new Date().toISOString(),
    },
  });

  return NextResponse.json({ success: true });
}
```

브라우저에서 `/api/test-notification` 접속

---

## 📊 모니터링 대시보드

### Sentry 대시보드

- **Issues**: 발생한 에러 목록
- **Performance**: API 응답 시간 추적
- **Releases**: 배포 버전별 에러 추적

### UptimeRobot 대시보드

- **Uptime**: 서비스 가동 시간 (목표: 99.9%)
- **Response Time**: 평균 응답 시간
- **Incidents**: 다운타임 기록

### Slack/Discord

- **실시간 알림**: Critical 에러 발생 시 즉시 알림
- **Webhook 실패**: 결제 처리 실패 시 알림

---

## 🎯 프로덕션 체크리스트

배포 전 확인:

- [ ] Sentry DSN 설정 완료
- [ ] Pino 로거 LOG_LEVEL=warn 설정
- [ ] Slack 또는 Discord Webhook URL 설정
- [ ] UptimeRobot 모니터 생성 완료
- [ ] Health Check 엔드포인트 테스트 완료
- [ ] Paddle IP 화이트리스트 설정 (선택사항)
- [ ] Cron Secret 설정 완료
- [ ] 테스트 알림 전송 확인
- [ ] Vercel 환경 변수 모두 설정
- [ ] 프로덕션 배포 후 Health Check 확인

---

## 🚨 트러블슈팅

### Sentry 에러가 안 잡힘

1. `NEXT_PUBLIC_SENTRY_DSN`이 제대로 설정되었는지 확인
2. `instrumentation.ts` 파일이 존재하는지 확인
3. Next.js를 재시작 (`npm run dev` 재실행)

### Slack/Discord 알림이 안 옴

1. Webhook URL이 올바른지 확인
2. `NOTIFICATIONS_IN_DEV=true` 설정 (개발 환경 테스트용)
3. 네트워크 연결 확인
4. Webhook URL이 만료되지 않았는지 확인

### Health Check가 503 반환

1. Firestore 연결 확인 (Firebase 콘솔에서 상태 확인)
2. Redis 연결 확인 (Redis 서버 상태 확인)
3. 환경 변수 확인 (필수 변수들이 모두 설정되었는지)

### Pino 로그가 안 보임

1. `LOG_LEVEL` 확인 (warn으로 설정되어 있으면 info 로그는 안 보임)
2. `LOG_LEVEL=debug`로 변경 후 테스트

---

## 📚 추가 리소스

- [Sentry Next.js 문서](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Pino 문서](https://getpino.io/)
- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [UptimeRobot 문서](https://uptimerobot.com/help/)

---

## 💡 베스트 프랙티스

1. **로그 레벨 관리**
   - 개발: `debug` (모든 로그)
   - 프로덕션: `warn` (경고와 에러만)

2. **알림 피로도 방지**
   - Critical만 Slack/Discord 알림
   - Warning은 Sentry로만 전송
   - Rate Limit 임계값 설정

3. **비용 최적화**
   - Sentry 무료 플랜: 월 5,000 이벤트
   - UptimeRobot 무료: 50개 모니터
   - Pino 로그 레벨로 비용 절감

4. **정기 점검**
   - 주 1회: UptimeRobot 리포트 확인
   - 월 1회: Sentry 이슈 트렌드 분석
   - 분기 1회: 로그 보관 정책 검토

---

**설정 완료!** 🎉

이제 프로덕션 환경에서 모든 에러와 다운타임을 실시간으로 모니터링할 수 있습니다.
