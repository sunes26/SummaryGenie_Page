// lib/logger.ts
/**
 * Production-ready Logger with Pino
 *
 * 로그 레벨:
 * - trace (10): 매우 상세한 디버깅
 * - debug (20): 디버깅 정보
 * - info (30): 일반 정보
 * - warn (40): 경고
 * - error (50): 에러
 * - fatal (60): 치명적 에러
 *
 * 환경별 설정:
 * - Development: pretty print, debug 레벨
 * - Production: JSON format, warn 레벨
 */

// ✅ 브라우저 환경 체크
const isBrowser = typeof window !== 'undefined';

// 브라우저 환경에서는 간단한 로거 사용
if (isBrowser) {
  // 브라우저용 로거 (기존 코드 유지)
  type LogLevel = 'debug' | 'info' | 'warn' | 'error';

  interface LogContext {
    [key: string]: unknown;
  }

  interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: LogContext;
    error?: Error;
  }

  class Logger {
    private isDevelopment: boolean;
    private isProduction: boolean;

    constructor() {
      this.isDevelopment = process.env.NODE_ENV === 'development';
      this.isProduction = process.env.NODE_ENV === 'production';
    }

    /**
     * Debug level logging (only in development)
     */
    debug(message: string, context?: LogContext) {
      if (this.isDevelopment) {
        this.log('debug', message, context);
      }
    }

    /**
     * Info level logging
     */
    info(message: string, context?: LogContext) {
      this.log('info', message, context);
    }

    /**
     * Warning level logging
     */
    warn(message: string, context?: LogContext) {
      this.log('warn', message, context);
    }

    /**
     * Error level logging
     */
    error(message: string, error?: Error | unknown, context?: LogContext) {
      const errorObj = error instanceof Error ? error : undefined;
      this.log('error', message, context, errorObj);
    }

    /**
     * Core logging method
     */
    private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
      const entry: LogEntry = {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
        error,
      };

      // Development: Pretty console output
      if (this.isDevelopment) {
        this.consoleLog(entry);
      }

      // Production: Send to Sentry
      if (this.isProduction && typeof window !== 'undefined' && (window as any).Sentry) {
        this.sendToSentry(entry);
      }
    }

    /**
     * Pretty console output for development
     */
    private consoleLog(entry: LogEntry) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[entry.level];

      const color = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[34m',  // Blue
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      }[entry.level];

      const reset = '\x1b[0m';

      const prefix = `${color}[${entry.level.toUpperCase()}]${reset} ${emoji}`;

      console.log(`${prefix} ${entry.message}`);

      if (entry.context && Object.keys(entry.context).length > 0) {
        console.log('  Context:', entry.context);
      }

      if (entry.error) {
        console.error('  Error:', entry.error);
      }
    }

    /**
     * Send logs to Sentry
     */
    private sendToSentry(entry: LogEntry) {
      const Sentry = (window as any).Sentry;
      if (!Sentry) return;

      if (entry.level === 'error' && entry.error) {
        Sentry.captureException(entry.error, {
          level: 'error',
          extra: entry.context,
          tags: { source: 'browser' },
        });
      } else if (entry.level === 'warn' || entry.level === 'error') {
        Sentry.captureMessage(entry.message, {
          level: entry.level,
          extra: entry.context,
          tags: { source: 'browser' },
        });
      }
    }

    /**
     * Create a child logger with default context
     */
    child(defaultContext: LogContext): Logger {
      const childLogger = new Logger();
      const originalLog = (childLogger as any).log.bind(childLogger);

      (childLogger as any).log = (level: LogLevel, message: string, context?: LogContext, error?: Error) => {
        const mergedContext = { ...defaultContext, ...context };
        originalLog(level, message, mergedContext, error);
      };

      return childLogger;
    }
  }

  // Export singleton instance
  export const logger = new Logger();
  export const createLogger = (context: LogContext) => logger.child(context);

  // Convenience exports for common use cases
  export const authLogger = createLogger({ module: 'auth' });
  export const apiLogger = createLogger({ module: 'api' });
  export const paddleLogger = createLogger({ module: 'paddle' });
  export const firebaseLogger = createLogger({ module: 'firebase' });

} else {
  // 서버 환경: Pino 사용
  const pino = require('pino');

  const isDevelopment = process.env.NODE_ENV === 'development';
  const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'warn');

  // Pino 기본 설정
  const pinoLogger = pino({
    level: logLevel,

    // 기본 필드 추가
    base: {
      env: process.env.NODE_ENV,
      revision: process.env.VERCEL_GIT_COMMIT_SHA,
    },

    // 타임스탬프 형식
    timestamp: pino.stdTimeFunctions.isoTime,

    // 개발 환경: 예쁘게 출력
    // 프로덕션: JSON 형식 (로그 분석 도구용)
    transport: isDevelopment ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    } : undefined,

    // 에러 직렬화 개선
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },

    // 포맷터
    formatters: {
      level: (label: string) => {
        return { level: label.toUpperCase() };
      },
    },

    // 프로덕션에서 민감한 정보 자동 제거
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'password',
        'token',
        'apiKey',
        'secret',
        '*.password',
        '*.token',
        '*.apiKey',
        '*.secret',
      ],
      remove: true,
    },
  });

  // Pino logger export
  export const logger = pinoLogger;

  /**
   * 자식 로거 생성 (컨텍스트 추가)
   */
  export function createLogger(context: Record<string, unknown>) {
    return pinoLogger.child(context);
  }

  // Convenience exports for common use cases
  export const authLogger = createLogger({ module: 'auth' });
  export const apiLogger = createLogger({ module: 'api' });
  export const paddleLogger = createLogger({ module: 'paddle' });
  export const firebaseLogger = createLogger({ module: 'firebase' });
}

// Default export
export default logger;
