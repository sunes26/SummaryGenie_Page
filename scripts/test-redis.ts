// scripts/test-redis.ts
// Redis 연결 테스트 스크립트

import { getRedisClient, testRedisConnection } from '../lib/redis';

async function testRedis() {
  console.log('🔍 Testing Redis connection...\n');

  // 1. Redis 클라이언트 가져오기
  const redis = getRedisClient();

  if (!redis) {
    console.log('❌ Redis client not available');
    console.log('   Environment variables missing:');
    console.log('   - UPSTASH_REDIS_REST_URL');
    console.log('   - UPSTASH_REDIS_REST_TOKEN\n');
    process.exit(1);
  }

  console.log('✅ Redis client created\n');

  // 2. 연결 테스트
  const isConnected = await testRedisConnection();

  if (!isConnected) {
    console.log('❌ Redis connection failed');
    console.log('   Check your credentials in environment variables\n');
    process.exit(1);
  }

  console.log('✅ Redis connection successful\n');

  // 3. 기본 작업 테스트
  try {
    // SET 테스트
    console.log('📝 Testing SET...');
    await redis.set('test:key', 'Hello Redis!', { ex: 60 });
    console.log('✅ SET successful\n');

    // GET 테스트
    console.log('📖 Testing GET...');
    const value = await redis.get('test:key');
    console.log(`✅ GET successful: ${value}\n`);

    // INCR 테스트
    console.log('➕ Testing INCR...');
    await redis.incr('test:counter');
    const counter = await redis.get('test:counter');
    console.log(`✅ INCR successful: ${counter}\n`);

    // DEL 테스트
    console.log('🗑️  Testing DEL...');
    await redis.del('test:key', 'test:counter');
    console.log('✅ DEL successful\n');

    console.log('🎉 All tests passed!');
    console.log('✅ Redis is ready to use for rate limiting\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testRedis();
