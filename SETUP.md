# Setup Guide - 환경 설정 가이드

이 문서는 프로젝트의 고급 기능을 설정하는 방법을 설명합니다.

## 📋 목차

1. [Webhook 자동 재시도 설정](#1-webhook-자동-재시도-설정)
2. [Redis Rate Limiting 설정](#2-redis-rate-limiting-설정)
3. [환경 변수 요약](#3-환경-변수-요약)

---

## 1. Webhook 자동 재시도 설정

Paddle 웹훅 처리가 실패했을 때 자동으로 재시도하는 기능입니다.

### 🎯 목적

- 일시적인 오류로 인한 웹훅 손실 방지
- Exponential backoff를 통한 지능적인 재시도
- 실패한 웹훅의 추적 및 모니터링

### 🔧 Vercel Cron 설정 (권장)

#### 1단계: vercel.json 확인

프로젝트 루트에 `vercel.json` 파일이 생성되어 있는지 확인합니다:

```json
{
  "crons": [
    {
      "path": "/api/cron/webhook-retry",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

- `schedule`: `*/5 * * * *` = 5분마다 실행
- 필요에 따라 스케줄 조정 가능:
  - `*/1 * * * *` = 1분마다 (더 빠른 재시도)
  - `*/10 * * * *` = 10분마다 (부하 감소)

#### 2단계: 환경 변수 설정 (선택사항)

Vercel Dashboard > Settings > Environment Variables에서 설정:

```env
# Cron job 보안 (선택사항이지만 권장)
CRON_SECRET=your-random-secret-key-here
```

`CRON_SECRET`을 설정하면 인증되지 않은 요청을 차단합니다.

#### 3단계: 배포

```bash
vercel --prod
```

Vercel이 자동으로 cron job을 설정합니다.

#### 4단계: 확인

Vercel Dashboard > Deployments > Cron Jobs에서 실행 상태 확인

### 🌐 외부 Cron 서비스 사용 (대안)

Vercel Hobby 플랜에서는 cron job이 제한될 수 있습니다. 이 경우 외부 서비스를 사용하세요:

#### 추천 서비스
- [cron-job.org](https://cron-job.org) - 무료
- [EasyCron](https://www.easycron.com) - 무료 플랜 제공
- [UptimeRobot](https://uptimerobot.com) - HTTP 모니터링 기능 활용

#### 설정 방법

1. 서비스에 가입
2. 새 cron job 생성:
   - **URL**: `https://yourdomain.com/api/cron/webhook-retry`
   - **Method**: GET
   - **Interval**: 5분
   - **Headers** (CRON_SECRET 사용 시):
     ```
     Authorization: Bearer your-cron-secret
     ```

### 📊 모니터링

Firestore `webhook_retry_queue` 컬렉션을 확인하여:
- `status: 'pending'` - 재시도 대기 중
- `status: 'failed'` - 최대 재시도 횟수 도달
- `retryCount` - 현재 재시도 횟수
- `nextRetryAt` - 다음 재시도 시간

### 🔄 재시도 전략

자동 재시도는 Exponential Backoff를 사용합니다:

| 시도 | 대기 시간 |
|------|-----------|
| 1    | 1분       |
| 2    | 5분       |
| 3    | 15분      |
| 4    | 30분      |
| 5    | 60분      |

최대 5회 재시도 후 `status: 'failed'`로 표시됩니다.

---

## 2. Redis Rate Limiting 설정

분산 환경에서의 정확한 rate limiting을 위한 Redis 설정입니다.

### 🎯 목적

- Serverless 환경에서 정확한 rate limiting
- 메모리 기반 저장소의 한계 극복
- 여러 인스턴스 간 일관성 있는 제한

### 🔧 Upstash Redis 설정 (권장)

#### 1단계: Upstash 계정 생성

1. [Upstash Console](https://console.upstash.com) 접속
2. 계정 생성 (GitHub/Google 로그인 가능)

#### 2단계: Redis 데이터베이스 생성

1. "Create Database" 클릭
2. 설정:
   - **Name**: `gena-page-ratelimit`
   - **Type**: Regional (또는 Global for 글로벌 서비스)
   - **Region**: 가장 가까운 지역 선택
   - **Eviction**: `allkeys-lru` (권장)
3. "Create" 클릭

#### 3단계: 환경 변수 설정

데이터베이스 생성 후 표시되는 credentials를 복사:

```env
# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
```

Vercel에 환경 변수 추가:
```bash
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN
```

또는 Vercel Dashboard > Settings > Environment Variables에서 추가

#### 4단계: 배포 및 확인

```bash
vercel --prod
```

로그에서 Redis 사용 확인:
```
Using Redis for rate limiting
```

Redis가 설정되지 않은 경우:
```
Using in-memory store for rate limiting (Redis not configured)
```

### 📊 Redis 설정 없이 사용하기

Redis 없이도 프로젝트는 정상 동작합니다:

- **자동 Fallback**: In-memory store 사용
- **제한사항**:
  - Serverless 인스턴스마다 독립적인 카운터
  - Cold start 시 카운터 초기화
  - 여러 인스턴스에서 정확도 감소

**권장**: 프로덕션 환경에서는 Redis 사용을 강력히 권장합니다.

### 🔍 Rate Limit 테스트

Redis가 올바르게 작동하는지 테스트:

```bash
# Rate limit 테스트 (연속 요청)
for i in {1..10}; do
  curl -X POST https://yourdomain.com/api/subscription/create \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"priceId": "pri_xxx"}'
  sleep 1
done
```

429 응답이 오면 rate limiting이 작동하는 것입니다.

### ⚙️ Rate Limit 설정 커스터마이징

`lib/rate-limit.ts`에서 제한 값을 조정할 수 있습니다:

```typescript
export const RATE_LIMITS = {
  // 인증 API - 엄격
  AUTH: {
    max: 5,                           // 1분에 5회
    windowMs: 60 * 1000,
    blockDurationMs: 10 * 60 * 1000,  // 10분 차단
  },

  // 구독 생성 - 보통
  SUBSCRIPTION_CREATE: {
    max: 3,                           // 1시간에 3회
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,  // 1시간 차단
  },

  // 구독 조작 - 보통
  SUBSCRIPTION_MUTATE: {
    max: 3,                           // 1분에 3회
    windowMs: 60 * 1000,
    blockDurationMs: 5 * 60 * 1000,   // 5분 차단
  },

  // 일반 조회 - 느슨
  GENERAL: {
    max: 60,                          // 1분에 60회
    windowMs: 60 * 1000,
  },
};
```

---

## 3. 환경 변수 요약

### 필수 환경 변수

```env
# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Paddle
PADDLE_API_KEY=your-paddle-api-key
PADDLE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your-client-token
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox # or production

# Admin
ADMIN_EMAILS=admin@example.com,admin2@example.com

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 선택적 환경 변수 (권장)

```env
# Webhook 재시도 보안
CRON_SECRET=your-random-secret-key

# Redis Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### 로컬 개발 환경 설정

`.env.local` 파일 생성:

```env
# 위의 모든 환경 변수 복사
# Redis는 선택사항 (로컬에서는 메모리 저장소 사용)
```

---

## 🚀 배포 체크리스트

프로덕션 배포 전 확인사항:

- [ ] 모든 필수 환경 변수 설정
- [ ] Redis 설정 (프로덕션 권장)
- [ ] Webhook 재시도 cron job 설정
- [ ] Admin 이메일 설정
- [ ] Paddle 웹훅 URL 등록 (`https://yourdomain.com/api/webhooks/paddle`)
- [ ] CSRF 토큰 설정 (`CSRF_SECRET`)
- [ ] Rate limiting 테스트

---

## 📞 문제 해결

### Webhook 재시도가 작동하지 않는 경우

1. Vercel Dashboard > Cron Jobs에서 실행 로그 확인
2. `webhook_retry_queue` 컬렉션에 pending 상태 문서가 있는지 확인
3. `CRON_SECRET`이 올바르게 설정되었는지 확인

### Redis 연결 오류

1. Upstash 환경 변수가 올바른지 확인
2. Upstash Console에서 데이터베이스 상태 확인
3. Rate limit 테스트 수행
4. 로그에서 "Using Redis" 메시지 확인

### Rate Limit이 너무 엄격한 경우

`lib/rate-limit.ts`에서 `RATE_LIMITS` 값을 조정하세요.

---

## 📚 추가 문서

- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Upstash Redis](https://docs.upstash.com/redis)
- [Paddle Webhooks](https://developer.paddle.com/webhooks/overview)
