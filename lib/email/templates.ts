// lib/email/templates.ts
/**
 * 이메일 템플릿 시스템
 */

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * 기본 이메일 레이아웃
 */
function getEmailLayout(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #fff;
          padding: 30px 20px;
          border: 1px solid #e0e0e0;
          border-top: none;
        }
        .footer {
          background: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        }
        .alert {
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .alert-info { background: #e3f2fd; border-left: 4px solid #2196f3; }
        .alert-warning { background: #fff3e0; border-left: 4px solid #ff9800; }
        .alert-error { background: #ffebee; border-left: 4px solid #f44336; }
        .alert-success { background: #e8f5e9; border-left: 4px solid #4caf50; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">Gena Page</h1>
        <p style="margin: 5px 0 0 0;">관리자 알림</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>이 이메일은 Gena Page 관리자 알림 시스템에서 자동으로 발송되었습니다.</p>
        <p>&copy; 2025 Gena Page. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * 새로운 구독 생성 알림
 */
export function getNewSubscriptionEmail(data: {
  userEmail: string;
  userName: string;
  plan: string;
  price: string;
  subscriptionId: string;
}): EmailTemplate {
  const html = getEmailLayout(`
    <div class="alert alert-success">
      <strong>✅ 새로운 구독이 생성되었습니다</strong>
    </div>

    <h2>구독 정보</h2>
    <ul>
      <li><strong>사용자:</strong> ${data.userName} (${data.userEmail})</li>
      <li><strong>플랜:</strong> ${data.plan}</li>
      <li><strong>가격:</strong> ${data.price}</li>
      <li><strong>구독 ID:</strong> ${data.subscriptionId}</li>
    </ul>

    <p>관리자 대시보드에서 자세한 내용을 확인하세요.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/subscriptions" class="button">구독 관리 바로가기</a>
  `);

  const text = `
새로운 구독이 생성되었습니다

사용자: ${data.userName} (${data.userEmail})
플랜: ${data.plan}
가격: ${data.price}
구독 ID: ${data.subscriptionId}

관리자 대시보드: ${process.env.NEXT_PUBLIC_APP_URL}/admin/subscriptions
  `;

  return {
    subject: `[Gena Page] 새로운 구독 생성: ${data.userEmail}`,
    html,
    text,
  };
}

/**
 * 구독 취소 알림
 */
export function getSubscriptionCanceledEmail(data: {
  userEmail: string;
  userName: string;
  plan: string;
  reason?: string;
  subscriptionId: string;
}): EmailTemplate {
  const html = getEmailLayout(`
    <div class="alert alert-warning">
      <strong>⚠️ 구독이 취소되었습니다</strong>
    </div>

    <h2>취소된 구독 정보</h2>
    <ul>
      <li><strong>사용자:</strong> ${data.userName} (${data.userEmail})</li>
      <li><strong>플랜:</strong> ${data.plan}</li>
      <li><strong>구독 ID:</strong> ${data.subscriptionId}</li>
      ${data.reason ? `<li><strong>취소 사유:</strong> ${data.reason}</li>` : ''}
    </ul>

    <p>사용자에게 연락하여 피드백을 수집하는 것을 고려해보세요.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/subscriptions" class="button">구독 관리 바로가기</a>
  `);

  const text = `
구독이 취소되었습니다

사용자: ${data.userName} (${data.userEmail})
플랜: ${data.plan}
구독 ID: ${data.subscriptionId}
${data.reason ? `취소 사유: ${data.reason}` : ''}

관리자 대시보드: ${process.env.NEXT_PUBLIC_APP_URL}/admin/subscriptions
  `;

  return {
    subject: `[Gena Page] 구독 취소: ${data.userEmail}`,
    html,
    text,
  };
}

/**
 * 결제 실패 알림
 */
export function getPaymentFailedEmail(data: {
  userEmail: string;
  userName: string;
  amount: string;
  reason?: string;
  subscriptionId: string;
}): EmailTemplate {
  const html = getEmailLayout(`
    <div class="alert alert-error">
      <strong>❌ 결제가 실패했습니다</strong>
    </div>

    <h2>결제 실패 정보</h2>
    <ul>
      <li><strong>사용자:</strong> ${data.userName} (${data.userEmail})</li>
      <li><strong>금액:</strong> ${data.amount}</li>
      <li><strong>구독 ID:</strong> ${data.subscriptionId}</li>
      ${data.reason ? `<li><strong>실패 사유:</strong> ${data.reason}</li>` : ''}
    </ul>

    <p>사용자의 결제 방법을 확인하고 필요시 지원을 제공하세요.</p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users" class="button">사용자 관리 바로가기</a>
  `);

  const text = `
결제가 실패했습니다

사용자: ${data.userName} (${data.userEmail})
금액: ${data.amount}
구독 ID: ${data.subscriptionId}
${data.reason ? `실패 사유: ${data.reason}` : ''}

관리자 대시보드: ${process.env.NEXT_PUBLIC_APP_URL}/admin/users
  `;

  return {
    subject: `[Gena Page] 결제 실패: ${data.userEmail}`,
    html,
    text,
  };
}

/**
 * 결제 성공 알림
 */
export function getPaymentSuccessEmail(data: {
  userEmail: string;
  userName: string;
  amount: string;
  transactionId: string;
}): EmailTemplate {
  const html = getEmailLayout(`
    <div class="alert alert-success">
      <strong>✅ 결제가 완료되었습니다</strong>
    </div>

    <h2>결제 정보</h2>
    <ul>
      <li><strong>사용자:</strong> ${data.userName} (${data.userEmail})</li>
      <li><strong>금액:</strong> ${data.amount}</li>
      <li><strong>거래 ID:</strong> ${data.transactionId}</li>
    </ul>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" class="button">대시보드 바로가기</a>
  `);

  const text = `
결제가 완료되었습니다

사용자: ${data.userName} (${data.userEmail})
금액: ${data.amount}
거래 ID: ${data.transactionId}

관리자 대시보드: ${process.env.NEXT_PUBLIC_APP_URL}/admin
  `;

  return {
    subject: `[Gena Page] 결제 완료: ${data.amount}`,
    html,
    text,
  };
}

/**
 * 새로운 사용자 가입 알림
 */
export function getNewUserEmail(data: {
  userEmail: string;
  userName: string;
  signupDate: string;
}): EmailTemplate {
  const html = getEmailLayout(`
    <div class="alert alert-info">
      <strong>👤 새로운 사용자가 가입했습니다</strong>
    </div>

    <h2>사용자 정보</h2>
    <ul>
      <li><strong>이름:</strong> ${data.userName}</li>
      <li><strong>이메일:</strong> ${data.userEmail}</li>
      <li><strong>가입일:</strong> ${data.signupDate}</li>
    </ul>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users" class="button">사용자 관리 바로가기</a>
  `);

  const text = `
새로운 사용자가 가입했습니다

이름: ${data.userName}
이메일: ${data.userEmail}
가입일: ${data.signupDate}

관리자 대시보드: ${process.env.NEXT_PUBLIC_APP_URL}/admin/users
  `;

  return {
    subject: `[Gena Page] 새로운 사용자 가입: ${data.userEmail}`,
    html,
    text,
  };
}

/**
 * 일일 요약 리포트
 */
export function getDailySummaryEmail(data: {
  date: string;
  newUsers: number;
  newSubscriptions: number;
  canceledSubscriptions: number;
  totalRevenue: string;
  activeUsers: number;
}): EmailTemplate {
  const html = getEmailLayout(`
    <h2>📊 일일 요약 리포트</h2>
    <p><strong>날짜:</strong> ${data.date}</p>

    <div class="alert alert-info">
      <h3>주요 지표</h3>
      <ul>
        <li><strong>신규 사용자:</strong> ${data.newUsers}명</li>
        <li><strong>신규 구독:</strong> ${data.newSubscriptions}건</li>
        <li><strong>구독 취소:</strong> ${data.canceledSubscriptions}건</li>
        <li><strong>총 매출:</strong> ${data.totalRevenue}</li>
        <li><strong>활성 사용자:</strong> ${data.activeUsers}명</li>
      </ul>
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" class="button">대시보드에서 자세히 보기</a>
  `);

  const text = `
일일 요약 리포트
날짜: ${data.date}

주요 지표:
- 신규 사용자: ${data.newUsers}명
- 신규 구독: ${data.newSubscriptions}건
- 구독 취소: ${data.canceledSubscriptions}건
- 총 매출: ${data.totalRevenue}
- 활성 사용자: ${data.activeUsers}명

관리자 대시보드: ${process.env.NEXT_PUBLIC_APP_URL}/admin
  `;

  return {
    subject: `[Gena Page] 일일 리포트 - ${data.date}`,
    html,
    text,
  };
}

/**
 * 테스트 이메일
 */
export function getTestEmail(recipientEmail: string): EmailTemplate {
  const html = getEmailLayout(`
    <div class="alert alert-success">
      <strong>✅ 테스트 이메일</strong>
    </div>

    <h2>이메일 알림 시스템 테스트</h2>
    <p>이 이메일은 Gena Page 이메일 알림 시스템의 테스트 메시지입니다.</p>
    <p>이 메시지를 받으셨다면 이메일 설정이 올바르게 구성된 것입니다.</p>

    <ul>
      <li>수신자: ${recipientEmail}</li>
      <li>발송 시간: ${new Date().toLocaleString('ko-KR')}</li>
    </ul>

    <p>이메일 알림이 정상적으로 작동하고 있습니다! 🎉</p>
  `);

  const text = `
테스트 이메일

이 이메일은 Gena Page 이메일 알림 시스템의 테스트 메시지입니다.
이 메시지를 받으셨다면 이메일 설정이 올바르게 구성된 것입니다.

수신자: ${recipientEmail}
발송 시간: ${new Date().toLocaleString('ko-KR')}

이메일 알림이 정상적으로 작동하고 있습니다!
  `;

  return {
    subject: '[Gena Page] 테스트 이메일',
    html,
    text,
  };
}
