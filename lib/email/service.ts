// lib/email/service.ts
import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}

/**
 * 이메일 전송 서비스
 *
 * 환경변수 설정 필요:
 * - EMAIL_FROM: 발신자 이메일 주소
 * - EMAIL_HOST: SMTP 서버 (예: smtp.gmail.com)
 * - EMAIL_PORT: SMTP 포트 (예: 587)
 * - EMAIL_USER: SMTP 사용자명
 * - EMAIL_PASSWORD: SMTP 비밀번호
 */
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  /**
   * Nodemailer transporter 초기화
   */
  private initializeTransporter() {
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    // 이메일 설정이 없으면 콘솔에만 출력 (개발 모드)
    if (!emailHost || !emailUser || !emailPassword) {
      console.warn('⚠️ Email configuration not found. Emails will be logged to console only.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: emailHost,
        port: parseInt(emailPort || '587'),
        secure: emailPort === '465', // true for 465, false for other ports
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      });

      console.log('✅ Email transporter initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error);
    }
  }

  /**
   * 이메일 전송
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@genapage.com';

    // Transporter가 없으면 콘솔에만 로그 출력
    if (!this.transporter) {
      console.log('📧 [DEV MODE] Email would be sent:');
      console.log('  From:', from);
      console.log('  To:', options.to);
      console.log('  Subject:', options.subject);
      console.log('  Text:', options.text);
      return true;
    }

    try {
      const info = await this.transporter.sendMail({
        from: `Gena Page <${from}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  /**
   * 여러 수신자에게 이메일 전송
   */
  async sendBulkEmail(recipients: string[], emailOptions: Omit<EmailOptions, 'to'>): Promise<{
    success: number;
    failed: number;
  }> {
    let success = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const sent = await this.sendEmail({
        ...emailOptions,
        to: recipient,
      });

      if (sent) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Transporter 연결 테스트
   */
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.log('⚠️ No email transporter configured (dev mode)');
      return true; // Dev mode에서는 true 반환
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email connection failed:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
let emailServiceInstance: EmailService | null = null;

/**
 * EmailService 싱글톤 인스턴스 가져오기
 */
export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService();
  }
  return emailServiceInstance;
}
