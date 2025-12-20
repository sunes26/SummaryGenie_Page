// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { getRedisClient } from '@/lib/redis';

/**
 * Health Check Endpoint
 * GET /api/health
 *
 * 서비스 상태를 확인하는 엔드포인트
 * - Firestore 연결 상태
 * - Redis 연결 상태 (optional)
 * - 기본 시스템 정보
 *
 * 모니터링 도구 (UptimeRobot, Pingdom 등)에서 사용 가능
 */
export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: 'ok' | 'error'; message?: string; latency?: number }> = {};

  // 1. Firestore 연결 확인
  try {
    const checkStart = Date.now();
    const db = getAdminFirestore();

    // 간단한 쿼리로 연결 테스트 (컬렉션은 실제 존재하는 것 사용)
    await db.collection('users').limit(1).get();

    checks.firestore = {
      status: 'ok',
      latency: Date.now() - checkStart,
    };
  } catch (error) {
    // Firestore 초기화 에러는 무시 (이미 작동 중이므로)
    if (error instanceof Error && error.message.includes('already been initialized')) {
      checks.firestore = {
        status: 'ok',
        message: 'Already initialized (normal)',
      };
    } else {
      checks.firestore = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // 2. Redis 연결 확인 (optional - Redis가 설정된 경우만)
  try {
    const checkStart = Date.now();
    const redis = getRedisClient();

    if (redis) {
      // Redis ping 테스트
      await redis.set('_health_check', Date.now().toString(), { ex: 10 });
      await redis.get('_health_check');

      checks.redis = {
        status: 'ok',
        latency: Date.now() - checkStart,
      };
    } else {
      checks.redis = {
        status: 'ok',
        message: 'Redis not configured (using in-memory store)',
      };
    }
  } catch (error) {
    checks.redis = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // 3. 환경 변수 확인 (민감 정보 제외)
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'FIREBASE_ADMIN_PROJECT_ID',
    'PADDLE_API_KEY',
    'PADDLE_WEBHOOK_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    checks.environment = {
      status: 'error',
      message: `Missing environment variables: ${missingEnvVars.join(', ')}`,
    };
  } else {
    checks.environment = {
      status: 'ok',
    };
  }

  // 4. 전체 상태 판정
  const allOk = Object.values(checks).every(check => check.status === 'ok');
  const totalLatency = Date.now() - startTime;

  const response = {
    status: allOk ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    latency: totalLatency,
    checks,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  };

  return NextResponse.json(response, {
    status: allOk ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

/**
 * HEAD 요청 지원 (일부 모니터링 도구용)
 */
export async function HEAD() {
  try {
    const db = getAdminFirestore();
    await db.collection('_health_check').limit(1).get();

    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
