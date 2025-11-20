// lib/auth-errors.ts
/**
 * Firebase Auth 에러 코드를 번역 키로 변환
 * 
 * @param errorCode - Firebase Auth 에러 코드 또는 에러 객체
 * @returns 번역 키 (예: "auth.errors.wrongPassword")
 * 
 * @example
 * ```tsx
 * import { getAuthErrorKey } from '@/lib/auth-errors';
 * import { useTranslation } from '@/hooks/useTranslation';
 * 
 * const { t } = useTranslation();
 * 
 * try {
 *   await changePassword(currentPassword, newPassword);
 * } catch (error: any) {
 *   const errorKey = getAuthErrorKey(error);
 *   showError(t(errorKey));
 * }
 * ```
 */
export function getAuthErrorKey(error: any): string {
  // 에러 코드 추출
  let code: string;
  
  if (typeof error === 'string') {
    code = error;
  } else if (error?.code) {
    code = error.code;
  } else if (error?.message) {
    // Error 객체에서 코드 추출 시도
    code = error.message;
  } else {
    return 'auth.errors.unknownError';
  }

  // Firebase Auth 에러 코드 매핑
  const errorKeyMap: Record<string, string> = {
    'auth/wrong-password': 'auth.errors.wrongPassword',
    'auth/email-already-in-use': 'auth.errors.emailInUse',
    'auth/invalid-email': 'auth.errors.invalidEmailFormat',
    'auth/requires-recent-login': 'auth.errors.recentLoginRequired',
    'auth/weak-password': 'auth.errors.weakPassword',
    'auth/user-not-found': 'auth.errors.userNotFound',
    'auth/too-many-requests': 'auth.errors.tooManyRequests',
    'auth/network-request-failed': 'auth.errors.networkError',
    'auth/popup-closed-by-user': 'auth.errors.popupClosed',
    'auth/cancelled-popup-request': 'auth.errors.popupCancelled',
  };

  return errorKeyMap[code] || 'auth.errors.unknownError';
}

/**
 * Firebase Auth 에러를 번역된 메시지로 변환
 * 
 * @param error - Firebase Auth 에러 객체
 * @param t - useTranslation의 t 함수
 * @returns 번역된 에러 메시지
 * 
 * @example
 * ```tsx
 * import { translateAuthError } from '@/lib/auth-errors';
 * import { useTranslation } from '@/hooks/useTranslation';
 * 
 * const { t } = useTranslation();
 * 
 * try {
 *   await changePassword(currentPassword, newPassword);
 * } catch (error: any) {
 *   const errorMessage = translateAuthError(error, t);
 *   showError(errorMessage);
 * }
 * ```
 */
export function translateAuthError(
  error: any,
  t: (key: string) => string
): string {
  const errorKey = getAuthErrorKey(error);
  return t(errorKey);
}