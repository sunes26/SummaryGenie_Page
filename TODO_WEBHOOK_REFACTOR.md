# TODO: Webhook 재시도 로직 완성

## 🎯 현재 상태

Webhook 재시도 시스템의 **인프라는 모두 완성**되었습니다:

- ✅ Cron job 엔드포인트 (`/api/cron/webhook-retry`)
- ✅ Firestore 재시도 큐 (`webhook_retry_queue`)
- ✅ Exponential backoff 로직
- ✅ 재시도 횟수 추적
- ✅ TTL 만료 처리
- ✅ Vercel Cron 설정 (`vercel.json`)

## ⚠️ 완성 필요 사항

`app/api/cron/webhook-retry/route.ts`의 `retryWebhookProcessing` 함수에서 실제 웹훅 처리 로직을 호출해야 합니다.

### 현재 코드 (Placeholder)

```typescript
// app/api/cron/webhook-retry/route.ts (Line 142-160)
async function retryWebhookProcessing(
  eventType: string,
  payload: Record<string, unknown>,
  signature?: string
): Promise<boolean> {
  try {
    // TODO: 실제 구현에서는 webhook/paddle/route.ts의 processWebhookEvent 사용
    // 예시:
    // const { processWebhookEvent } = await import('@/app/api/webhooks/paddle/webhook-processor');
    // return await processWebhookEvent(eventType, payload);

    console.log(`Processing webhook retry: ${eventType}`);

    // 임시 구현: 항상 실패로 처리 (실제 구현 필요)
    return false;

  } catch (error) {
    console.error('Webhook retry processing error:', error);
    return false;
  }
}
```

### 필요한 리팩토링

#### Option 1: 웹훅 처리 로직을 별도 모듈로 분리 (권장)

1. **새 파일 생성**: `app/api/webhooks/paddle/webhook-processor.ts`

```typescript
// app/api/webhooks/paddle/webhook-processor.ts
import { getAdminFirestore } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
// ... 기타 imports

/**
 * Paddle 웹훅 이벤트 처리
 *
 * @param eventType - Paddle 이벤트 타입
 * @param payload - 웹훅 페이로드
 * @returns 처리 성공 여부
 */
export async function processWebhookEvent(
  eventType: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  // app/api/webhooks/paddle/route.ts에서 기존 처리 로직 복사

  switch (eventType) {
    case 'subscription.created':
      return await handleSubscriptionCreated(payload);

    case 'subscription.updated':
      return await handleSubscriptionUpdated(payload);

    case 'subscription.canceled':
      return await handleSubscriptionCanceled(payload);

    // ... 기타 이벤트 타입

    default:
      console.warn(`Unknown event type: ${eventType}`);
      return false;
  }
}

async function handleSubscriptionCreated(payload: any): Promise<boolean> {
  // 구독 생성 처리 로직
  // ...
  return true;
}

async function handleSubscriptionUpdated(payload: any): Promise<boolean> {
  // 구독 업데이트 처리 로직
  // ...
  return true;
}

async function handleSubscriptionCanceled(payload: any): Promise<boolean> {
  // 구독 취소 처리 로직
  // ...
  return true;
}

// ... 기타 핸들러 함수들
```

2. **기존 웹훅 핸들러 수정**: `app/api/webhooks/paddle/route.ts`

```typescript
// app/api/webhooks/paddle/route.ts
import { processWebhookEvent } from './webhook-processor';

export async function POST(request: NextRequest) {
  // ... 서명 검증 등 기존 코드 ...

  try {
    // 웹훅 처리
    const success = await processWebhookEvent(event_type, payload);

    if (!success) {
      throw new Error('Webhook processing failed');
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    // 재시도 큐에 추가
    await db.collection('webhook_retry_queue').add({
      eventId: event_id,
      eventType: event_type,
      payload: payload,
      signature: signatureHeader,
      // ... 기존 코드 ...
    });

    return NextResponse.json({ received: true });
  }
}
```

3. **재시도 핸들러 업데이트**: `app/api/cron/webhook-retry/route.ts`

```typescript
// app/api/cron/webhook-retry/route.ts
import { processWebhookEvent } from '@/app/api/webhooks/paddle/webhook-processor';

async function retryWebhookProcessing(
  eventType: string,
  payload: Record<string, unknown>,
  signature?: string
): Promise<boolean> {
  try {
    // ✅ 실제 웹훅 처리 로직 호출
    return await processWebhookEvent(eventType, payload);
  } catch (error) {
    console.error('Webhook retry processing error:', error);
    return false;
  }
}
```

#### Option 2: 직접 웹훅 엔드포인트 호출 (간단하지만 비효율적)

```typescript
async function retryWebhookProcessing(
  eventType: string,
  payload: Record<string, unknown>,
  signature?: string
): Promise<boolean> {
  try {
    // 내부 HTTP 요청으로 웹훅 엔드포인트 호출
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/webhooks/paddle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Paddle-Signature': signature || '',
      },
      body: JSON.stringify({
        event_type: eventType,
        ...payload,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Webhook retry processing error:', error);
    return false;
  }
}
```

**⚠️ Option 2의 단점**:
- HTTP 오버헤드
- 서명 검증 필요 (서명이 없으면 실패)
- Serverless 함수 호출 비용

**권장**: **Option 1**을 사용하여 코드 재사용성과 효율성을 높이세요.

---

## 📋 구현 체크리스트

- [ ] `webhook-processor.ts` 모듈 생성
- [ ] 기존 웹훅 처리 로직을 모듈로 이동
- [ ] `route.ts`에서 모듈 import
- [ ] `webhook-retry/route.ts`에서 모듈 import
- [ ] 테스트:
  - [ ] 정상 웹훅 처리 동작 확인
  - [ ] 실패 시 재시도 큐 추가 확인
  - [ ] Cron job 실행 시 재시도 성공 확인
- [ ] 배포

---

## 🧪 테스트 방법

### 1. 수동으로 재시도 큐에 항목 추가

Firestore Console에서 `webhook_retry_queue` 컬렉션에 테스트 문서 추가:

```json
{
  "eventId": "evt_test_123",
  "eventType": "subscription.created",
  "payload": {
    "id": "sub_test_123",
    "customer_id": "ctm_test_123",
    "status": "active"
  },
  "retryCount": 0,
  "maxRetries": 5,
  "nextRetryAt": "2024-01-01T00:00:00Z",  // 과거 시간
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 2. Cron job 수동 실행

```bash
curl https://yourdomain.com/api/cron/webhook-retry \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 3. 결과 확인

- 성공: 문서가 `webhook_retry_queue`에서 삭제됨
- 실패: `retryCount` 증가, `nextRetryAt` 업데이트

---

## 💡 추가 개선 아이디어

1. **Dead Letter Queue**
   - `status: 'failed'` 문서를 별도 컬렉션으로 이동
   - 관리자가 수동으로 재처리 가능하도록

2. **알림 시스템**
   - 재시도 실패 시 이메일/Slack 알림
   - 중요 이벤트 실패 시 즉시 알림

3. **우선순위 큐**
   - 중요 이벤트 (subscription.created)를 우선 처리
   - `priority` 필드 추가

4. **모니터링 대시보드**
   - 재시도 성공률 통계
   - 실패 원인 분석
   - 평균 재시도 횟수

---

**상태**: 🟡 인프라 완료, 로직 연결 필요
**우선순위**: P1 (높음)
**예상 작업 시간**: 1-2시간
