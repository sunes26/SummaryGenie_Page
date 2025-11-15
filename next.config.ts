import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ========================================
   * 이미지 최적화 설정
   * ======================================== */
  images: {
    // 최적화할 이미지 형식
    formats: ['image/webp', 'image/avif'],
    
    // 외부 이미지 도메인 허용 (Firebase Storage)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google 프로필 사진
        pathname: '/**',
      },
    ],
    
    // 이미지 크기 최적화
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 이미지 캐싱 (1년)
    minimumCacheTTL: 31536000,
    
    // 품질 설정 (기본 75)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  /* ========================================
   * 번들 최적화
   * ======================================== */
  // 프로덕션 소스맵 제거 (번들 크기 감소)
  productionBrowserSourceMaps: false,

  // SWC 컴파일러 최적화
  swcMinify: true,

  // 실험적 기능
  experimental: {
    // React 18 기능 최적화
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'recharts',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
    ],
    
    // 서버 액션 최적화
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  /* ========================================
   * 컴파일 최적화
   * ======================================== */
  compiler: {
    // 프로덕션에서 console 제거 (선택사항)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  /* ========================================
   * 웹팩 최적화 (고급)
   * ======================================== */
  webpack: (config, { dev, isServer }) => {
    // 번들 분석 (개발 환경에서만)
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze.html',
          openAnalyzer: true,
        })
      );
    }

    // Recharts 최적화 (Tree Shaking 개선)
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'recharts': 'recharts/es6',
      };
    }

    // Firebase 최적화
    config.resolve.alias = {
      ...config.resolve.alias,
      '@firebase/auth': '@firebase/auth/dist/esm/index.node.js',
      '@firebase/firestore': '@firebase/firestore/dist/esm/index.node.js',
    };

    return config;
  },

  /* ========================================
   * 압축 설정
   * ======================================== */
  compress: true, // Gzip 압축 활성화

  /* ========================================
   * 헤더 설정 (보안 + 성능)
   * ======================================== */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 보안 헤더
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // 캐싱 헤더
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 정적 파일 캐싱 (1년)
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API 캐싱 비활성화
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  /* ========================================
   * 리다이렉트 설정
   * ======================================== */
  async redirects() {
    return [
      // 필요시 리다이렉트 규칙 추가
    ];
  },

  /* ========================================
   * 환경 변수 (타입 안전성)
   * ======================================== */
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /* ========================================
   * 추가 설정
   * ======================================== */
  // 빌드 시 ESLint 무시 (선택사항)
  eslint: {
    ignoreDuringBuilds: false,
  },

  // 빌드 시 TypeScript 에러 무시 안 함
  typescript: {
    ignoreBuildErrors: false,
  },

  // 출력 설정
  output: 'standalone', // Docker 배포 시 유용

  // 페이지 확장자
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // 전원 모드 (성능 우선)
  poweredByHeader: false,

  // React Strict Mode
  reactStrictMode: true,
};

export default nextConfig;