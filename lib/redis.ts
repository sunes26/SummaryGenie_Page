// lib/redis.ts
import { Redis } from '@upstash/redis';

/**
 * Upstash Redis 클라이언트
 *
 * 환경 변수 설정:
 * - UPSTASH_REDIS_REST_URL: Redis REST API URL
 * - UPSTASH_REDIS_REST_TOKEN: Redis REST API 토큰
 *
 * Upstash Console에서 얻을 수 있음: https://console.upstash.com
 */

let redis: Redis | null = null;

/**
 * Redis 클라이언트 가져오기 (싱글톤)
 */
export function getRedisClient(): Redis | null {
  // Redis 환경 변수가 없으면 null 반환 (메모리 저장소로 fallback)
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Redis credentials not found. Rate limiting will use in-memory store.');
    return null;
  }

  // 싱글톤 패턴
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return redis;
}

/**
 * Redis 연결 테스트
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    const client = getRedisClient();
    if (!client) {
      return false;
    }

    await client.ping();
    return true;
  } catch (error) {
    console.error('Redis connection test failed:', error);
    return false;
  }
}
