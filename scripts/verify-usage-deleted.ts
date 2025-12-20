// scripts/verify-usage-deleted.ts
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { getAdminFirestore } from '../lib/firebase/admin';

/**
 * /usage 컬렉션이 삭제되었는지 확인하는 스크립트
 *
 * 실행 방법:
 * npx tsx scripts/verify-usage-deleted.ts
 */
async function verifyUsageCollectionDeleted() {
  try {
    console.log('🔍 Checking if /usage collection exists...\n');

    const db = getAdminFirestore();

    // /usage 컬렉션 확인
    const usageSnapshot = await db.collection('usage').limit(1).get();

    if (usageSnapshot.empty) {
      console.log('✅ SUCCESS: /usage collection is empty or deleted');
      console.log('   No documents found in /usage collection\n');
      return true;
    } else {
      console.log('⚠️  WARNING: /usage collection still exists!');
      console.log(`   Found ${usageSnapshot.size} document(s)\n`);

      // 첫 번째 문서 정보 출력
      const firstDoc = usageSnapshot.docs[0];
      console.log('   First document:');
      console.log(`   - ID: ${firstDoc.id}`);
      console.log(`   - Data:`, JSON.stringify(firstDoc.data(), null, 2));
      console.log('');

      // 전체 문서 개수 확인 (선택사항)
      console.log('🔍 Counting all documents in /usage collection...');
      const allDocs = await db.collection('usage').count().get();
      console.log(`   Total documents: ${allDocs.data().count}\n`);

      return false;
    }
  } catch (error) {
    console.error('❌ ERROR:', error);
    return false;
  }
}

// 스크립트 실행
verifyUsageCollectionDeleted()
  .then((isDeleted) => {
    if (isDeleted) {
      console.log('✨ Verification complete: Migration successful!');
      process.exit(0);
    } else {
      console.log('⚠️  Verification complete: Migration may be incomplete');
      console.log('   Please delete the /usage collection manually or run the migration script again');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
