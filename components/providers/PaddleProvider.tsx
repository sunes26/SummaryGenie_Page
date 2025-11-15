// components/providers/PaddleProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import type { Paddle, InitializePaddleOptions } from '@paddle/paddle-js';

/**
 * ✅ 최적화된 Paddle Provider (TypeScript 에러 수정)
 * - Script 태그로 지연 로딩
 * - afterInteractive 전략으로 성능 개선
 * - 올바른 Paddle.js v2 API 사용
 */
export function PaddleProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  // Paddle 환경 설정
  const paddleEnv = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';
  const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  useEffect(() => {
    // Paddle 스크립트 로드 완료 후 초기화
    const initializePaddle = async () => {
      if (typeof window === 'undefined' || !window.Paddle) {
        return;
      }

      if (!paddleToken) {
        console.warn('⚠️ Paddle client token not found');
        return;
      }

      try {
        // ✅ Paddle.js v2 올바른 초기화 방법
        const options: InitializePaddleOptions = {
          token: paddleToken,
          // environment는 token에 이미 포함되어 있으므로 별도로 지정하지 않음
          eventCallback: (event) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Paddle Event:', event.name);
            }
          },
        };

        // Setup 호출
        window.Paddle?.Setup(options);
        
        setIsReady(true);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Paddle initialized (${paddleEnv} mode)`);
        }
      } catch (error) {
        console.error('❌ Paddle initialization failed:', error);
      }
    };

    // Paddle 스크립트 로드 확인
    const checkPaddle = setInterval(() => {
      if (window.Paddle) {
        clearInterval(checkPaddle);
        initializePaddle();
      }
    }, 100);

    // 10초 후 타임아웃
    const timeout = setTimeout(() => {
      clearInterval(checkPaddle);
      if (!window.Paddle) {
        console.error('❌ Paddle script failed to load');
      }
    }, 10000);

    return () => {
      clearInterval(checkPaddle);
      clearTimeout(timeout);
    };
  }, [paddleEnv, paddleToken]);

  return (
    <>
      {/* ✅ Next.js Script로 Paddle.js 로드 (afterInteractive) */}
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Paddle.js script loaded');
          }
        }}
        onError={(e) => {
          console.error('❌ Failed to load Paddle.js:', e);
        }}
      />
      
      {children}
    </>
  );
}

// ============================================
// Window 타입 확장 (TypeScript)
// ============================================
declare global {
  interface Window {
    Paddle?: Paddle;
  }
}