// app/layout.tsx
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { PaddleProvider } from '@/components/providers/PaddleProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from 'react-hot-toast';
import { generateMetadata as genMeta } from '@/lib/metadata';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-kr',
});

// ✅ 기본 메타데이터
export const metadata: Metadata = genMeta({
  title: 'Gena - AI 웹페이지 요약',
  description: '웹 서핑 시간은 절반으로, 정보의 깊이는 두 배로. Chrome 확장 프로그램으로 한 번의 클릭으로 웹페이지를 AI가 요약합니다.',
  keywords: ['AI 요약', '웹페이지 요약', '크롬 확장프로그램', 'Chrome extension'],
  canonical: '/',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKr.variable} font-sans antialiased`}>
        {/* ✅ Language Provider - 최상위에 배치 */}
        <LanguageProvider>
          {/* ✅ Auth Provider */}
          <AuthProvider>
            {/* ✅ Paddle Provider */}
            <PaddleProvider>
              {children}
              
              {/* Toast 알림 */}
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#333',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </PaddleProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}