// lib/notifications.ts
/**
 * Slack/Discord 알림 시스템
 *
 * Critical 에러 발생 시 즉시 알림을 발송합니다.
 */

interface NotificationPayload {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  metadata?: Record<string, unknown>;
  error?: Error;
  timestamp?: Date;
}

/**
 * Slack Webhook으로 알림 전송
 */
async function sendSlackNotification(payload: NotificationPayload): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured');
    return false;
  }

  try {
    const color = {
      info: '#36a64f',      // Green
      warning: '#ff9800',   // Orange
      error: '#f44336',     // Red
      critical: '#9c27b0',  // Purple
    }[payload.severity];

    const emoji = {
      info: ':information_source:',
      warning: ':warning:',
      error: ':x:',
      critical: ':rotating_light:',
    }[payload.severity];

    // Slack 메시지 포맷
    const message = {
      username: 'Gena Monitoring',
      icon_emoji: emoji,
      attachments: [
        {
          color,
          title: `${emoji} ${payload.title}`,
          text: payload.message,
          fields: [
            {
              title: 'Severity',
              value: payload.severity.toUpperCase(),
              short: true,
            },
            {
              title: 'Environment',
              value: process.env.NODE_ENV || 'unknown',
              short: true,
            },
            {
              title: 'Timestamp',
              value: (payload.timestamp || new Date()).toISOString(),
              short: false,
            },
            // 메타데이터가 있으면 추가
            ...(payload.metadata ? Object.entries(payload.metadata).map(([key, value]) => ({
              title: key,
              value: String(value),
              short: true,
            })) : []),
          ],
          // 에러 스택 추가
          ...(payload.error && {
            footer: `Error: ${payload.error.message}`,
            footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
          }),
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Failed to send Slack notification:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return false;
  }
}

/**
 * Discord Webhook으로 알림 전송
 */
async function sendDiscordNotification(payload: NotificationPayload): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL not configured');
    return false;
  }

  try {
    const color = {
      info: 0x36a64f,      // Green
      warning: 0xff9800,   // Orange
      error: 0xf44336,     // Red
      critical: 0x9c27b0,  // Purple
    }[payload.severity];

    // Discord Embed 포맷
    const message = {
      username: 'Gena Monitoring',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/891/891462.png',
      embeds: [
        {
          title: payload.title,
          description: payload.message,
          color,
          fields: [
            {
              name: 'Severity',
              value: payload.severity.toUpperCase(),
              inline: true,
            },
            {
              name: 'Environment',
              value: process.env.NODE_ENV || 'unknown',
              inline: true,
            },
            {
              name: 'Timestamp',
              value: (payload.timestamp || new Date()).toISOString(),
              inline: false,
            },
            // 메타데이터가 있으면 추가
            ...(payload.metadata ? Object.entries(payload.metadata).map(([key, value]) => ({
              name: key,
              value: String(value),
              inline: true,
            })) : []),
            // 에러 메시지 추가
            ...(payload.error ? [{
              name: 'Error',
              value: `\`\`\`${payload.error.message}\`\`\``,
              inline: false,
            }] : []),
          ],
          timestamp: (payload.timestamp || new Date()).toISOString(),
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Failed to send Discord notification:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Discord notification:', error);
    return false;
  }
}

/**
 * 모든 활성화된 채널로 알림 전송
 */
export async function sendNotification(payload: NotificationPayload): Promise<void> {
  // 개발 환경에서는 알림 비활성화 (선택사항)
  if (process.env.NODE_ENV === 'development' && process.env.NOTIFICATIONS_IN_DEV !== 'true') {
    console.log('[Notification Skipped - Dev]', payload.title);
    return;
  }

  // 병렬로 모든 채널에 전송
  const promises: Promise<boolean>[] = [];

  if (process.env.SLACK_WEBHOOK_URL) {
    promises.push(sendSlackNotification(payload));
  }

  if (process.env.DISCORD_WEBHOOK_URL) {
    promises.push(sendDiscordNotification(payload));
  }

  if (promises.length === 0) {
    console.warn('No notification channels configured');
    return;
  }

  try {
    const results = await Promise.allSettled(promises);
    const failedCount = results.filter(r => r.status === 'rejected').length;

    if (failedCount > 0) {
      console.error(`Failed to send ${failedCount} notifications`);
    }
  } catch (error) {
    console.error('Unexpected error in sendNotification:', error);
  }
}

/**
 * Critical 에러 알림 (즉시 발송)
 */
export async function notifyCriticalError(
  title: string,
  error: Error,
  metadata?: Record<string, unknown>
): Promise<void> {
  await sendNotification({
    title,
    message: `Critical error occurred: ${error.message}`,
    severity: 'critical',
    error,
    metadata,
    timestamp: new Date(),
  });
}

/**
 * 결제 실패 알림
 */
export async function notifyPaymentFailure(
  userId: string,
  transactionId: string,
  error: Error
): Promise<void> {
  await sendNotification({
    title: '💳 Payment Failure',
    message: `Payment failed for user ${userId}`,
    severity: 'error',
    error,
    metadata: {
      userId,
      transactionId,
    },
  });
}

/**
 * Webhook 실패 알림 (여러 번 재시도 후에만)
 */
export async function notifyWebhookFailure(
  eventId: string,
  eventType: string,
  retryCount: number,
  error: Error
): Promise<void> {
  // 최대 재시도 도달 시에만 알림
  if (retryCount >= 5) {
    await sendNotification({
      title: '🔄 Webhook Processing Failed',
      message: `Webhook ${eventType} failed after ${retryCount} retries`,
      severity: 'critical',
      error,
      metadata: {
        eventId,
        eventType,
        retryCount,
      },
    });
  }
}

/**
 * 서비스 다운 알림
 */
export async function notifyServiceDown(
  service: string,
  error: Error
): Promise<void> {
  await sendNotification({
    title: '🚨 Service Down',
    message: `${service} is not responding`,
    severity: 'critical',
    error,
    metadata: {
      service,
    },
  });
}

/**
 * 보안 경고 알림
 */
export async function notifySecurityAlert(
  title: string,
  message: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await sendNotification({
    title: `🔒 Security Alert: ${title}`,
    message,
    severity: 'warning',
    metadata,
  });
}

/**
 * Rate Limit 초과 알림 (특정 임계값 이상일 때만)
 */
export async function notifyRateLimitExceeded(
  identifier: string,
  endpoint: string,
  count: number
): Promise<void> {
  // 1시간에 100회 이상 초과 시에만 알림
  if (count >= 100) {
    await sendNotification({
      title: '⚠️ Rate Limit Exceeded',
      message: `${identifier} exceeded rate limit ${count} times`,
      severity: 'warning',
      metadata: {
        identifier,
        endpoint,
        count,
      },
    });
  }
}
