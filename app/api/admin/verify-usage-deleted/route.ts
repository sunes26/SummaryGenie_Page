// app/api/admin/verify-usage-deleted/route.ts
import { NextRequest } from 'next/server';
import { verifyIdToken } from '@/lib/firebase/admin-utils';
import { requireAdminToken } from '@/lib/admin-auth';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { requireCSRFToken } from '@/lib/csrf';
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  safeInternalServerErrorResponse,
} from '@/lib/api-response';

/**
 * /usage 컬렉션이 삭제되었는지 확인하는 엔드포인트
 * GET /api/admin/verify-usage-deleted
 *
 * 플로우:
 * 1. Firebase ID 토큰 인증
 * 2. 관리자 권한 확인
 * 3. /usage 컬렉션 존재 여부 확인
 * 4. 존재하면 샘플 문서 정보 반환
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Firebase ID 토큰 인증
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse('인증 헤더가 누락되었거나 올바르지 않습니다.');
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;

    try {
      decodedToken = await verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return unauthorizedResponse('토큰이 유효하지 않거나 만료되었습니다.');
    }

    // 2. 관리자 권한 확인
    try {
      requireAdminToken(decodedToken);
    } catch (error) {
      console.error('Admin authorization failed:', {
        email: decodedToken.email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return forbiddenResponse('관리자 권한이 필요합니다.');
    }

    // 3. Firestore 작업
    const db = getAdminFirestore();

    // 3-1. /usage 컬렉션 확인 (limit 1로 존재 여부만 확인)
    const usageSnapshot = await db.collection('usage').limit(1).get();

    if (usageSnapshot.empty) {
      // 컬렉션이 비어있음 (삭제됨)
      return successResponse(
        {
          exists: false,
          message: '/usage collection is empty or deleted',
          migrationComplete: true,
        },
        '✅ /usage 컬렉션이 삭제되었습니다.'
      );
    }

    // 컬렉션이 존재함
    const firstDoc = usageSnapshot.docs[0];

    // 전체 문서 개수 확인
    const countSnapshot = await db.collection('usage').count().get();
    const totalCount = countSnapshot.data().count;

    return successResponse(
      {
        exists: true,
        totalDocuments: totalCount,
        sampleDocument: {
          id: firstDoc.id,
          data: firstDoc.data(),
        },
        message: '/usage collection still exists',
        migrationComplete: false,
        action: 'Please run the migration script or delete the collection manually',
      },
      `⚠️ /usage 컬렉션이 아직 존재합니다. (총 ${totalCount}개 문서)`
    );

  } catch (error) {
    return safeInternalServerErrorResponse(
      '확인 중 오류가 발생했습니다.',
      error,
      'Verification error'
    );
  }
}

/**
 * POST 요청 - CSRF 보호 적용
 */
export async function POST(request: NextRequest) {
  try {
    // CSRF 보호
    const csrfResponse = await requireCSRFToken(request);
    if (csrfResponse) {
      return csrfResponse;
    }

    // GET 요청과 동일한 로직 실행
    return GET(request);
  } catch (error) {
    return safeInternalServerErrorResponse(
      '확인 중 오류가 발생했습니다.',
      error,
      'Verification error'
    );
  }
}
