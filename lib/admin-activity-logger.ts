// lib/admin-activity-logger.ts
/**
 * 클라이언트 사이드 관리자 활동 로깅 유틸리티
 */

import { User } from 'firebase/auth';

interface LogActivityParams {
  user: User;
  action: 'page_access' | 'user_view' | 'data_export' | 'email_sent';
  details: Record<string, unknown>;
}

/**
 * 관리자 활동 로깅
 */
export async function logAdminActivity({
  user,
  action,
  details,
}: LogActivityParams): Promise<boolean> {
  try {
    const token = await user.getIdToken();

    const response = await fetch('/api/admin/activity-log', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        details,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to log admin activity:', error);
    return false;
  }
}

/**
 * 페이지 접근 로깅
 */
export async function logPageAccess(user: User, page: string): Promise<void> {
  await logAdminActivity({
    user,
    action: 'page_access',
    details: { page },
  });
}

/**
 * 사용자 조회 로깅
 */
export async function logUserView(
  user: User,
  targetUserId: string,
  targetUserEmail: string
): Promise<void> {
  await logAdminActivity({
    user,
    action: 'user_view',
    details: {
      targetUserId,
      targetUserEmail,
    },
  });
}

/**
 * 데이터 내보내기 로깅
 */
export async function logDataExport(
  user: User,
  exportType: 'users' | 'subscriptions' | 'audit_logs',
  recordCount: number,
  filters?: Record<string, unknown>
): Promise<void> {
  await logAdminActivity({
    user,
    action: 'data_export',
    details: {
      exportType,
      recordCount,
      filters,
    },
  });
}

/**
 * 이메일 전송 로깅
 */
export async function logEmailSent(
  user: User,
  recipientEmail: string,
  emailType: string
): Promise<void> {
  await logAdminActivity({
    user,
    action: 'email_sent',
    details: {
      recipientEmail,
      emailType,
    },
  });
}
