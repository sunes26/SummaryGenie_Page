// lib/admin-auth.ts
import { DecodedIdToken } from 'firebase-admin/auth';

/**
 * 관리자 이메일 목록 가져오기
 * 환경 변수 ADMIN_EMAILS에서 쉼표로 구분된 이메일 목록을 파싱
 */
export function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || '';

  if (!adminEmailsEnv) {
    console.warn('⚠️ ADMIN_EMAILS environment variable is not set');
    return [];
  }

  return adminEmailsEnv
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
}

/**
 * 사용자가 관리자인지 확인
 *
 * @param email - 확인할 이메일 주소
 * @returns boolean - 관리자 여부
 */
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) {
    return false;
  }

  const adminEmails = getAdminEmails();

  if (adminEmails.length === 0) {
    console.warn('⚠️ No admin emails configured');
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isAdminUser = adminEmails.includes(normalizedEmail);

  if (isAdminUser) {
    console.info('✅ Admin access granted:', normalizedEmail);
  }

  return isAdminUser;
}

/**
 * Firebase ID 토큰에서 관리자 여부 확인
 *
 * @param decodedToken - Firebase Admin SDK로 검증된 토큰
 * @returns boolean - 관리자 여부
 */
export function isAdminToken(decodedToken: DecodedIdToken): boolean {
  return isAdmin(decodedToken.email);
}

/**
 * 관리자 권한 확인 (에러 throw)
 * API 라우트에서 사용하기 위한 헬퍼 함수
 *
 * @param email - 확인할 이메일 주소
 * @throws Error - 관리자가 아닌 경우
 */
export function requireAdmin(email: string | undefined | null): void {
  if (!isAdmin(email)) {
    throw new Error('관리자 권한이 필요합니다.');
  }
}

/**
 * Firebase ID 토큰 기반 관리자 권한 확인 (에러 throw)
 *
 * @param decodedToken - Firebase Admin SDK로 검증된 토큰
 * @throws Error - 관리자가 아닌 경우
 */
export function requireAdminToken(decodedToken: DecodedIdToken): void {
  requireAdmin(decodedToken.email);
}
