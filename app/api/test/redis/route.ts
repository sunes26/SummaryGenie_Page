// app/api/test/redis/route.ts
// Redis 연결 테스트 엔드포인트
// GET /api/test/redis

import { NextResponse } from 'next/server';
import { getRedisClient, testRedisConnection } from '@/lib/redis';

export async function GET() {
  const results: Array<{ test: string; status: 'success' | 'failed'; message: string; data?: unknown }> = [];

  // 1. Redis 클라이언트 확인
  const redis = getRedisClient();

  if (!redis) {
    return NextResponse.json({
      success: false,
      message: 'Redis not configured',
      hint: 'Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to environment variables',
      fallback: 'Using in-memory store for rate limiting',
    }, { status: 200 });
  }

  results.push({
    test: 'Client Creation',
    status: 'success',
    message: 'Redis client created successfully',
  });

  // 2. 연결 테스트
  const isConnected = await testRedisConnection();

  if (!isConnected) {
    return NextResponse.json({
      success: false,
      message: 'Redis connection failed',
      results,
      hint: 'Check your Upstash credentials',
    }, { status: 500 });
  }

  results.push({
    test: 'Connection',
    status: 'success',
    message: 'Redis connection successful (PING)',
  });

  // 3. SET 테스트
  try {
    await redis.set('test:redis:key', 'Hello from Gena Page!', { ex: 60 });
    results.push({
      test: 'SET',
      status: 'success',
      message: 'SET command successful',
      data: { key: 'test:redis:key', value: 'Hello from Gena Page!', ttl: 60 },
    });
  } catch (error) {
    results.push({
      test: 'SET',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // 4. GET 테스트
  try {
    const value = await redis.get('test:redis:key');
    results.push({
      test: 'GET',
      status: 'success',
      message: 'GET command successful',
      data: { key: 'test:redis:key', value },
    });
  } catch (error) {
    results.push({
      test: 'GET',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // 5. INCR 테스트
  try {
    await redis.incr('test:redis:counter');
    const counter = await redis.get('test:redis:counter');
    results.push({
      test: 'INCR',
      status: 'success',
      message: 'INCR command successful',
      data: { key: 'test:redis:counter', value: counter },
    });
  } catch (error) {
    results.push({
      test: 'INCR',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // 6. TTL 테스트
  try {
    const ttl = await redis.ttl('test:redis:key');
    results.push({
      test: 'TTL',
      status: 'success',
      message: 'TTL command successful',
      data: { key: 'test:redis:key', ttl: `${ttl} seconds` },
    });
  } catch (error) {
    results.push({
      test: 'TTL',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // 7. DEL 테스트
  try {
    await redis.del('test:redis:key', 'test:redis:counter');
    results.push({
      test: 'DEL',
      status: 'success',
      message: 'DEL command successful (cleanup)',
    });
  } catch (error) {
    results.push({
      test: 'DEL',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // 최종 결과
  const allPassed = results.every(r => r.status === 'success');

  return NextResponse.json({
    success: allPassed,
    message: allPassed
      ? '✅ All Redis tests passed! Redis is ready for rate limiting.'
      : '❌ Some Redis tests failed. Check the results below.',
    timestamp: new Date().toISOString(),
    results,
  });
}
