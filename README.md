# SummaryGenie Page 🌟

> AI 기반 웹페이지 요약 Chrome 확장 프로그램을 위한 웹 대시보드 및 구독 관리 플랫폼

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwind-css)
![Paddle](https://img.shields.io/badge/Paddle-Billing-7C3AED)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production-success)

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [빠른 시작](#-빠른-시작)
- [환경 변수 설정](#-환경-변수-설정)
- [Firebase 설정 가이드](#-firebase-설정-가이드)
- [Paddle 설정 가이드](#-paddle-설정-가이드)
- [개발 가이드](#-개발-가이드)
- [Firebase 데이터 구조](#-firebase-데이터-구조)
- [API 엔드포인트](#-api-엔드포인트)
- [다국어 지원](#-다국어-지원)
- [배포](#-배포)
- [트러블슈팅](#-트러블슈팅)
- [개발 체크리스트](#-개발-체크리스트)
- [기여하기](#-기여하기)
- [라이센스](#-라이센스)

---

## 🎯 프로젝트 개요

**SummaryGenie Page**는 Chrome 확장 프로그램과 연동되는 웹 대시보드로, 사용자의 요약 기록을 관리하고 Pro 구독을 제공하는 SaaS 플랫폼입니다.

### 주요 목표

- ✅ **기존 Firebase 데이터**를 활용한 웹 대시보드 구축
- ✅ 사용자 요약 기록 조회 및 관리 인터페이스 제공
- ✅ **Paddle Billing**을 통한 프리미엄 구독 모델 수익화
- ✅ 사용 통계 및 분석 대시보드 제공
- ✅ 실시간 구독 상태 동기화 및 관리
- ✅ Paddle API 직접 조회를 통한 구독 정보 자동/수동 동기화
- ✅ **완벽한 SEO 최적화** (검색 엔진 노출 극대화)
- ✅ **다국어 지원** (한국어/영어)

### 프로젝트 현황

| Phase | 상태 | 기간 | 설명 |
|-------|------|------|------|
| Phase 1 | ✅ 완료 | 3주 | 프로젝트 기반 구축, Firebase 연동 |
| Phase 2 | ✅ 완료 | 2주 | 요약 기록 관리, 검색/필터링 |
| Phase 3 | ✅ 완료 | 2주 | Paddle 결제 시스템 연동 |
| Phase 4 | ✅ 완료 | 1주 | 실시간 구독 동기화, 웹훅 처리 |
| Phase 5 | ✅ 완료 | 1주 | SEO 최적화, 프로필 설정, 성능 개선 |
| Phase 6 | 📅 예정 | - | 고급 기능 (팀 공유, 태그 관리) |

---

## ✨ 주요 기능

### 🔐 인증 시스템
- ✅ 이메일/비밀번호 로그인/회원가입
- ✅ Google 소셜 로그인
- ✅ 이메일 인증
- ✅ 비밀번호 재설정
- ✅ **세션 쿠키 기반 인증** (5일 유효)
- ✅ 보호된 라우트 (Next.js Middleware)

### 📊 대시보드
- ✅ 실시간 사용량 통계
- ✅ 최근 7일 사용 그래프 (Recharts)
- ✅ 이번 달 요약 횟수
- ✅ 최근 요약 기록 5개
- ✅ 가장 활발한 요일 분석
- ✅ 도메인별 통계
- ✅ Pro/Free 플랜 상태 표시

### 📝 요약 기록 관리
- ✅ 무한 스크롤 페이지네이션
- ✅ **제목 + 내용 기반 실시간 검색** (디바운스 500ms)
- ✅ 도메인별 필터링
- ✅ 정렬 (최신순/오래된 순)
- ✅ 상세 내용 모달 뷰
- ✅ 요약문 복사 기능
- ✅ 반응형 디자인 (데스크톱/모바일)
- ✅ 중복 제거 및 최적화된 데이터 로딩

### 💳 구독 관리 (Paddle Billing)
- ✅ Free/Pro 플랜 제공 (₩9,900/월)
- ✅ Paddle Checkout 오버레이 결제
- ✅ 구독 취소 및 재개
- ✅ 결제 수단 변경
- ✅ 구독 상태 실시간 추적
- ✅ Webhook을 통한 자동 동기화
- ✅ **Paddle API 직접 조회를 통한 수동 동기화** ⭐
- ✅ 구독 만료일 계산 및 알림
- ✅ 결제 내역 관리
- ✅ **구독 갱신 시 자동 업데이트**

### ⚙️ 설정
- ✅ 프로필 편집 (이름, 프로필 사진)
- ✅ **프로필 사진 업로드** (Firebase Storage, 최대 2MB) ⭐
- ✅ **이미지 업로드 진행률 표시** ⭐
- ✅ 이메일 변경 (재인증 필요)
- ✅ 비밀번호 변경 (재인증 포함)
- ✅ 알림 설정
- ✅ 사용 통계 확인
- ✅ 계정 보안 설정

### 🌐 다국어 지원 ⭐ NEW
- ✅ **한국어/영어 완벽 지원**
- ✅ 실시간 언어 전환
- ✅ URL 기반 언어 감지
- ✅ 브라우저 언어 자동 감지
- ✅ 모든 UI 텍스트 번역
- ✅ 에러 메시지 번역
- ✅ SEO 메타데이터 번역

### 🔍 SEO 최적화 ⭐
- ✅ **동적 사이트맵 생성** (sitemap.xml)
- ✅ **robots.txt 자동 생성**
- ✅ **PWA 매니페스트** (앱 설치 가능)
- ✅ **구조화된 데이터** (JSON-LD Schema.org)
  - Organization Schema (회사 정보)
  - WebApplication Schema (앱 정보)
  - Product Schema (Pro 구독)
  - FAQ Schema (자주 묻는 질문)
  - Breadcrumb Schema (네비게이션)
- ✅ **페이지별 최적화된 메타데이터**
  - Open Graph (Facebook, LinkedIn)
  - Twitter Cards
  - Canonical URLs
- ✅ **완전한 요금제 페이지** (Pricing)
- ✅ **시맨틱 HTML** (접근성 개선)

---

## 🛠 기술 스택

### Frontend
- **Next.js 15** (App Router) - React 프레임워크
- **TypeScript 5** - 타입 안정성
- **Tailwind CSS 3** - 유틸리티 기반 스타일링
- **Shadcn/ui** - 고품질 UI 컴포넌트
- **Headless UI** - 접근성 높은 UI 컴포넌트
- **Recharts** - 데이터 시각화
- **React Hot Toast** - 알림 시스템
- **SWR** - 데이터 페칭 및 캐싱
- **React Hook Form** - 폼 관리
- **Lucide React** - 아이콘 라이브러리

### Backend & Database
- **Firebase Authentication** - 사용자 인증
- **Firebase Firestore** - NoSQL 데이터베이스 (서브컬렉션 구조)
- **Firebase Storage** - 파일 저장소 (프로필 사진)
- **Next.js API Routes** - 서버리스 API
- **Firebase Admin SDK** - 서버 사이드 Firebase 작업

### 결제 & 구독
- **Paddle Billing** - 결제 처리 및 구독 관리
- **Paddle Webhooks** - 구독 이벤트 처리
- **Paddle.js v2** - 클라이언트 SDK
- **Paddle REST API** - 서버 사이드 구독 조회 및 관리

### SEO & 성능
- **Next.js Metadata API** - 서버 사이드 메타데이터
- **JSON-LD** - 구조화된 데이터
- **PWA Support** - 앱 설치 가능
- **Dynamic Imports** - 코드 스플리팅
- **Image Optimization** - WebP, AVIF 지원

### 배포 & 호스팅
- **Vercel** - 자동 배포 및 호스팅
- **GitHub Actions** - CI/CD (선택사항)

---

## 📁 프로젝트 구조

```
summarygenie_page/
│
├─ 📄 설정 파일
│  ├─ .env.example                         # 환경 변수 예시
│  ├─ .env.local                           # 환경 변수 (git 제외)
│  ├─ .gitignore                           # Git 제외 목록
│  ├─ components.json                      # shadcn/ui 설정
│  ├─ eslint.config.mjs                    # ESLint 설정
│  ├─ middleware.ts                        # Next.js 미들웨어 (라우트 보호)
│  ├─ next-env.d.ts                        # Next.js 타입 정의
│  ├─ next.config.ts                       # Next.js 설정
│  ├─ package-lock.json                    # NPM 의존성 잠금
│  ├─ package.json                         # NPM 패키지 설정
│  ├─ postcss.config.js                    # PostCSS 설정
│  ├─ README.md                            # 프로젝트 문서
│  ├─ tailwind.config.js                   # Tailwind CSS 설정
│  ├─ tsconfig.json                        # TypeScript 설정
│  └─ tsconfig.tsbuildinfo                 # TypeScript 빌드 정보
│
├─ 📂 app/                                 # Next.js 15 App Router
│  │
│  ├─ (auth)/                              # 🔐 인증 관련 페이지 그룹
│  │  ├─ forgot-password/
│  │  │  └─ page.tsx                       # 비밀번호 재설정
│  │  ├─ login/
│  │  │  ├─ layout.tsx                     # 로그인 레이아웃 ⭐
│  │  │  └─ page.tsx                       # 로그인 페이지
│  │  ├─ signup/
│  │  │  └─ page.tsx                       # 회원가입 페이지
│  │  └─ verify-email/
│  │     └─ page.tsx                       # 이메일 인증 확인
│  │
│  ├─ (dashboard)/                         # 📊 대시보드 (인증 필요)
│  │  ├─ layout.tsx                        # 대시보드 레이아웃 (사이드바)
│  │  ├─ dashboard/
│  │  │  └─ page.tsx                       # 대시보드 홈 (통계, 최근 요약)
│  │  ├─ history/
│  │  │  └─ page.tsx                       # 요약 기록 조회 (검색, 필터)
│  │  ├─ settings/
│  │  │  └─ page.tsx                       # 설정 (프로필, 보안, 알림, 통계)
│  │  └─ subscription/
│  │     └─ page.tsx                       # 구독 관리 (Free/Pro)
│  │
│  ├─ (marketing)/                         # 🎯 마케팅 페이지 그룹
│  │  ├─ layout.tsx                        # 마케팅 레이아웃 ⭐
│  │  ├─ page.tsx                          # 랜딩 페이지 (SEO 최적화)
│  │  ├─ about/                            # 소개 페이지 (예정)
│  │  └─ pricing/
│  │     └─ page.tsx                       # 요금제 페이지 ⭐
│  │
│  ├─ api/                                 # 🔌 API Routes
│  │  │
│  │  ├─ auth/                             # 인증 API
│  │  │  └─ session/
│  │  │     └─ route.ts                    # 세션 쿠키 생성/검증/삭제 ⭐
│  │  │                                    # POST: 세션 생성 (5일 유효)
│  │  │                                    # GET: 세션 검증
│  │  │                                    # DELETE: 로그아웃
│  │  │
│  │  ├─ subscription/                     # 구독 관리 API
│  │  │  ├─ cancel/
│  │  │  │  └─ route.ts                    # 구독 취소 (다음 결제일까지 유지)
│  │  │  ├─ create/
│  │  │  │  └─ route.ts                    # Pro 플랜 구독 생성 (Paddle Checkout)
│  │  │  ├─ resume/
│  │  │  │  └─ route.ts                    # 취소 예정 구독 재개 ⭐
│  │  │  ├─ status/
│  │  │  │  └─ route.ts                    # 구독 상태 조회 ⭐
│  │  │  ├─ sync/
│  │  │  │  └─ route.ts                    # 수동 동기화 (Paddle API 직접 조회) ⭐⭐
│  │  │  └─ update-payment/
│  │  │     └─ route.ts                    # 결제 수단 변경 URL 생성 ⭐
│  │  │
│  │  ├─ webhooks/                         # 웹훅 API
│  │  │  └─ paddle/
│  │  │     └─ route.ts                    # Paddle 웹훅 수신 (구독 이벤트 처리)
│  │  │
│  │  ├─ test-admin/
│  │  │  └─ route.ts                       # Firebase Admin 테스트 ⭐
│  │  └─ test-queries/
│  │     └─ route.ts                       # Firestore 쿼리 테스트 ⭐
│  │
│  ├─ test-firebase/
│  │  └─ page.tsx                          # Firebase 연결 테스트 페이지 ⭐
│  ├─ test-language/
│  │  └─ page.tsx                          # 다국어 테스트 페이지 ⭐
│  │
│  ├─ favicon.ico                          # 파비콘
│  ├─ globals.css                          # 전역 CSS (Tailwind 포함)
│  ├─ layout.tsx                           # 루트 레이아웃 (SEO, 폰트, Provider)
│  ├─ manifest.ts                          # PWA 매니페스트 생성 ⭐
│  ├─ robots.ts                            # robots.txt 생성 ⭐
│  └─ sitemap.ts                           # 동적 사이트맵 생성 ⭐
│
├─ 📂 components/                          # React 컴포넌트
│  │
│  ├─ dashboard/                           # 대시보드 컴포넌트
│  │  ├─ DomainFilter.tsx                  # 도메인 필터 드롭다운
│  │  ├─ HistoryModal.tsx                  # 요약 상세 모달
│  │  ├─ HistoryTable.tsx                  # 요약 기록 테이블
│  │  ├─ MobileHeader.tsx                  # 모바일 헤더 (햄버거 메뉴) ⭐
│  │  ├─ NotificationSettings.tsx          # 알림 설정 ⭐
│  │  ├─ page.tsx                          # (??)
│  │  ├─ ProfileSettings.tsx               # 프로필 설정 (이름, 사진 업로드) ⭐
│  │  ├─ RecentHistory.tsx                 # 최근 요약 5개 표시 ⭐
│  │  ├─ SearchBar.tsx                     # 검색 바 (디바운스)
│  │  ├─ SecuritySettings.tsx              # 보안 설정 (이메일/비밀번호 변경) ⭐
│  │  ├─ Sidebar.tsx                       # 사이드바 네비게이션
│  │  ├─ StatsCard.tsx                     # 통계 카드 컴포넌트
│  │  ├─ StatsOverview.tsx                 # 통계 개요 ⭐
│  │  └─ UsageChart.tsx                    # 사용량 차트 (Recharts)
│  │
│  ├─ marketing/                           # 마케팅 컴포넌트
│  │  ├─ FAQ.tsx                           # 자주 묻는 질문
│  │  ├─ Features.tsx                      # 기능 소개
│  │  ├─ FinalCTA.tsx                      # 최종 CTA ⭐
│  │  ├─ Footer.tsx                        # 푸터 ⭐
│  │  ├─ Header.tsx                        # 헤더 (로그인/회원가입)
│  │  ├─ Hero.tsx                          # 히어로 섹션
│  │  ├─ HowItWorks.tsx                    # 사용 방법 ⭐
│  │  ├─ Pricing.tsx                       # 요금제 비교
│  │  ├─ ProblemStatement.tsx              # 문제 제기 섹션 ⭐
│  │  ├─ ScrollReveal.tsx                  # 스크롤 애니메이션 ⭐
│  │  └─ UseCases.tsx                      # 사용 사례 ⭐
│  │
│  ├─ payment/                             # 결제 컴포넌트
│  │  ├─ PaddleCheckout.tsx                # Paddle 체크아웃 버튼 ⭐
│  │  └─ SubscriptionInfo.tsx              # 구독 정보 표시 ⭐
│  │
│  ├─ providers/                           # Context Provider
│  │  └─ PaddleProvider.tsx                # Paddle.js 초기화 ⭐
│  │
│  ├─ seo/                                 # SEO 컴포넌트 ⭐
│  │  ├─ DynamicMeta.tsx                   # 동적 메타 태그 (클라이언트)
│  │  └─ JsonLd.tsx                        # JSON-LD 구조화된 데이터
│  │
│  ├─ ui/                                  # Shadcn UI 컴포넌트
│  │  ├─ button.tsx                        # 버튼
│  │  ├─ card.tsx                          # 카드
│  │  ├─ dialog.tsx                        # 다이얼로그/모달
│  │  ├─ dropdown-menu.tsx                 # 드롭다운 메뉴
│  │  ├─ input.tsx                         # 입력 필드
│  │  ├─ label.tsx                         # 라벨
│  │  ├─ select.tsx                        # 셀렉트
│  │  ├─ tabs.tsx                          # 탭
│  │  ├─ textarea.tsx                      # 텍스트 영역
│  │  └─ toast.tsx                         # 토스트 알림
│  │
│  ├─ Header.tsx                           # 공통 헤더
│  ├─ LanguageSwitcher.tsx                 # 언어 전환 버튼 ⭐
│  ├─ LogoutButton.tsx                     # 로그아웃 버튼
│  └─ UserProfile.tsx                      # 사용자 프로필 표시
│
├─ 📂 contexts/                            # React Context
│  ├─ AuthContext.tsx                      # 인증 컨텍스트
│  └─ LanguageContext.tsx                  # 다국어 컨텍스트 ⭐
│
├─ 📂 hooks/                               # Custom React Hooks
│  ├─ useAuth.ts                           # 인증 상태 관리
│  ├─ useHistory.ts                        # 요약 기록 조회 (무한 스크롤)
│  ├─ useSubscription.ts                   # 구독 상태 관리
│  ├─ useTranslation.ts                    # 다국어 번역 훅 ⭐
│  └─ useUsageStats.ts                     # 사용량 통계 조회
│
├─ 📂 lib/                                 # 유틸리티 & 설정
│  │
│  ├─ firebase/                            # Firebase 관련
│  │  ├─ admin.ts                          # Firebase Admin SDK 초기화
│  │  ├─ admin-utils.ts                    # Admin 유틸리티 함수 ⭐
│  │  ├─ client.ts                         # Firebase 클라이언트 초기화
│  │  ├─ client-queries.ts                 # 클라이언트 쿼리 헬퍼 ⭐
│  │  ├─ queries.ts                        # Firestore 쿼리 함수
│  │  ├─ storage.ts                        # Storage 작업 (프로필 사진) ⭐
│  │  ├─ types.ts                          # Firebase 타입 정의 ⭐
│  │  └─ utils.ts                          # Firebase 유틸리티 ⭐
│  │
│  ├─ api-client.ts                        # API 클라이언트 ⭐
│  ├─ auth-errors.ts                       # 인증 에러 메시지 ⭐
│  ├─ auth.ts                              # 인증 헬퍼 함수 ⭐
│  ├─ image-loader.ts                      # 이미지 로더 ⭐
│  ├─ language.ts                          # 언어 설정 유틸리티 ⭐
│  ├─ metadata.ts                          # SEO 메타데이터 헬퍼 ⭐
│  ├─ paddle.ts                            # Paddle 클라이언트 SDK ⭐
│  ├─ paddle-server.ts                     # Paddle 서버 API ⭐
│  ├─ paddle-webhook.ts                    # Paddle 웹훅 처리 ⭐
│  ├─ toast-helpers.ts                     # 토스트 알림 헬퍼 ⭐
│  └─ utils.ts                             # 공통 유틸리티
│
├─ 📂 messages/                            # 다국어 번역 파일 ⭐
│  ├─ en.json                              # 영어 번역
│  └─ ko.json                              # 한국어 번역
│
├─ 📂 public/                              # 정적 파일
│  ├─ images/
│  │  └─ logo.png                          # 로고 이미지
│  ├─ file.svg                             # 아이콘
│  ├─ globe.svg                            # 아이콘
│  ├─ manifest.json                        # PWA 매니페스트
│  ├─ next.svg                             # Next.js 로고
│  ├─ vercel.svg                           # Vercel 로고
│  └─ window.svg                           # 아이콘
│
└─ 📂 types/                               # TypeScript 타입 정의
   ├─ index.ts                             # 공통 타입
   └─ paddle.ts                            # Paddle 타입 (구독, 트랜잭션) ⭐
```

### 📊 파일 개수 통계

| 디렉토리 | 파일 수 | 설명 |
|---------|---------|------|
| `app/` | 30+ | 페이지, API Routes, 메타데이터 |
| `components/` | 35+ | UI 컴포넌트 |
| `lib/` | 15+ | 유틸리티, Firebase, Paddle |
| `hooks/` | 5 | Custom React Hooks |
| `messages/` | 2 | 다국어 번역 (한국어, 영어) |
| `types/` | 2 | TypeScript 타입 정의 |
| **총계** | **90+** | **전체 소스 파일** |

---

## 🚀 빠른 시작

### 사전 요구사항

- **Node.js** 20.x 이상
- **npm** 또는 **yarn**
- **Firebase 프로젝트** (기존 프로젝트 연결)
- **Paddle 계정** (Sandbox 또는 Production)

### 1단계: 저장소 클론

```bash
git clone https://github.com/your-username/summarygenie_page.git
cd summarygenie_page
```

### 2단계: 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 3단계: Shadcn/ui 컴포넌트 설치 (이미 설치되어 있다면 생략)

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add select
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
```

### 4단계: 환경 변수 설정

`.env.local` 파일을 생성하고 아래 환경 변수를 설정합니다. ([환경 변수 섹션](#-환경-변수-설정) 참조)

### 5단계: 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 6단계: 빌드 (프로덕션)

```bash
npm run build
npm start
# 또는
yarn build
yarn start
```

---

## 🔐 환경 변수 설정

### 필수 환경 변수

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# ========================================
# Firebase 클라이언트 (NEXT_PUBLIC_*)
# ========================================
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# ========================================
# Firebase Admin (서버 사이드)
# ========================================
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# ⚠️ 주의: PRIVATE_KEY는 반드시 큰따옴표로 감싸고 \n을 그대로 유지하세요

# ========================================
# Paddle (결제 & 구독)
# ========================================
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
# 프로덕션: production

NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_xxxxxxxxxxxxx
# Paddle Dashboard → Developer Tools → Authentication → Client-side Tokens

PADDLE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Paddle Dashboard → Developer Tools → Authentication → API Keys

PADDLE_WEBHOOK_SECRET=pdl_ntfset_01xxxxxxxxxxxxxxxxx
# Paddle Dashboard → Developer Tools → Notifications → Webhook Secret

# Paddle Price IDs
NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY=pri_01xxxxxxxxxxxxxxxxx
# Paddle Dashboard → Catalog → Products → Prices

# ========================================
# 앱 설정
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
# 프로덕션: https://your-domain.com
```

### 환경 변수 설명

| 변수명 | 설명 | 필수 | 예시 |
|--------|------|------|------|
| **Firebase 클라이언트** |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API 키 | ✅ | `AIzaSyC...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth 도메인 | ✅ | `my-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID | ✅ | `my-project-12345` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage 버킷 | ✅ | `my-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM Sender ID | ✅ | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | ✅ | `1:123:web:abc` |
| **Firebase Admin** |
| `FIREBASE_ADMIN_PROJECT_ID` | Admin용 프로젝트 ID | ✅ | `my-project-12345` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | 서비스 계정 이메일 | ✅ | `firebase-adminsdk-xxx@...` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | 서비스 계정 Private Key | ✅ | `"-----BEGIN...` |
| **Paddle** |
| `NEXT_PUBLIC_PADDLE_ENVIRONMENT` | Paddle 환경 | ✅ | `sandbox` / `production` |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Paddle 클라이언트 토큰 | ✅ | `test_xxx` / `live_xxx` |
| `PADDLE_API_KEY` | Paddle API 키 (서버용) | ✅ | `xxx` |
| `PADDLE_WEBHOOK_SECRET` | Paddle 웹훅 시크릿 | ✅ | `pdl_ntfset_xxx` |
| `NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY` | Pro 플랜 Price ID | ✅ | `pri_01xxx` |
| **앱 설정** |
| `NEXT_PUBLIC_APP_URL` | 앱 기본 URL | ✅ | `https://summarygenie.app` |

---

## 🔥 Firebase 설정 가이드

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력: `SummaryGenie`
4. Google Analytics 활성화 (선택사항)

### 2. Firebase Authentication 설정

#### 이메일/비밀번호 인증

1. Firebase Console > **Authentication** > **Sign-in method**
2. **이메일/비밀번호** 활성화

#### Google 소셜 로그인

1. **Google** 제공업체 활성화
2. 프로젝트 지원 이메일 설정

### 3. Firebase Firestore 설정

#### 데이터베이스 생성

1. Firebase Console > **Firestore Database** > **데이터베이스 만들기**
2. **테스트 모드에서 시작** 선택
3. 리전: `asia-northeast3 (Seoul)`

#### 보안 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 사용자 문서 및 서브컬렉션
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // history 서브컬렉션
      match /history/{historyId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // daily 서브컬렉션
      match /daily/{dailyId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // subscription 컬렉션 (최상위)
    match /subscription/{subId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow write: if false; // 서버에서만 쓰기
    }
  }
}
```

#### 필수 인덱스

**1. history 컬렉션:**
```
Collection: users/{userId}/history
Fields:
  - deletedAt (Ascending)
  - createdAt (Descending)
```

**2. daily 컬렉션:**
```
Collection: users/{userId}/daily
Fields:
  - date (Ascending)
```

**3. subscription 컬렉션:**
```
Collection: subscription
Fields:
  - userId (Ascending)
```

### 4. Firebase Storage 설정

#### Storage 버킷 생성

1. Firebase Console > **Storage** > **시작하기**
2. 리전: `asia-northeast3 (Seoul)`

#### Storage 보안 규칙

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // 프로필 사진 (최대 2MB)
    match /profiles/{userId}/{fileName} {
      allow read: if true; // 공개 읽기
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 2 * 1024 * 1024 && // 2MB
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 5. Firebase Admin SDK 설정

#### 서비스 계정 키 생성

1. Firebase Console > **프로젝트 설정** > **서비스 계정**
2. **새 비공개 키 생성** 클릭
3. JSON 파일 다운로드
4. 내용을 `.env.local`에 복사

---

## 🎯 Paddle 설정 가이드

### 1. Paddle 계정 생성

1. [Paddle 웹사이트](https://www.paddle.com/) 방문
2. **Start Free** 클릭
3. 이메일 인증

### 2. Sandbox 모드 활성화

- Paddle Dashboard 우측 상단에서 **Sandbox** 모드로 전환

### 3. API 키 생성

#### Client Token (클라이언트용)

1. Paddle Dashboard > **Developer Tools** > **Authentication**
2. **Client-side Tokens** 탭
3. **New Client-side Token** 클릭
4. 도메인 제한 설정 (권장):
   - `localhost:3000`
   - `your-domain.com`

```env
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_xxxxxxxxxxxxx
```

#### API Key (서버용)

1. **API Keys** 탭
2. **New API Key** 클릭
3. 권한 선택:
   - ✅ Read subscriptions
   - ✅ Write subscriptions
   - ✅ Read transactions

```env
PADDLE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 상품(Product) 생성

#### Pro 플랜 상품

1. Paddle Dashboard > **Catalog** > **Products**
2. **New Product** 클릭
3. 상품 정보:
   - **Name**: SummaryGenie Pro
   - **Description**: AI 기반 무제한 웹페이지 요약
   - **Type**: Standard

#### Price 생성

1. 생성한 Product > **Prices** 탭
2. **New Price** 클릭
3. 가격 설정:
   - **Billing Cycle**: Monthly
   - **Amount**: ₩9,900
   - **Currency**: KRW

```env
NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY=pri_01xxxxxxxxxxxxxxxxx
```

### 5. Webhook 설정

#### Webhook URL 등록

1. Paddle Dashboard > **Developer Tools** > **Notifications**
2. **New Destination** 클릭
3. **URL**: `https://your-domain.com/api/webhooks/paddle`

#### 이벤트 선택

다음 이벤트를 **모두 선택**:

- ✅ `subscription.created`
- ✅ `subscription.updated`
- ✅ `subscription.canceled`
- ✅ `subscription.past_due`
- ✅ `subscription.paused`
- ✅ `subscription.resumed`
- ✅ `transaction.completed`
- ✅ `transaction.updated`

#### Webhook Secret 복사

```env
PADDLE_WEBHOOK_SECRET=pdl_ntfset_01xxxxxxxxxxxxxxxxx
```

### 6. 로컬 개발 Webhook 테스트

#### ngrok 사용

```bash
# ngrok 설치 (macOS)
brew install ngrok

# ngrok 실행
ngrok http 3000
```

ngrok HTTPS URL을 Paddle Webhook에 추가:
```
https://xxxx-xxx-xxx-xxx.ngrok.io/api/webhooks/paddle
```

---

## 📖 개발 가이드

### 코드 스타일

```bash
# ESLint 실행
npm run lint

# 타입 체크
npx tsc --noEmit
```

### Git 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 작업, 도구 변경
perf: 성능 개선
```

### 브랜치 전략

```
main        - 프로덕션 환경
develop     - 개발 브랜치
feature/*   - 새 기능
fix/*       - 버그 수정
hotfix/*    - 긴급 수정
```

---

## 💾 Firebase 데이터 구조

### 서브컬렉션 구조

```typescript
// lib/firebase/types.ts

/**
 * History 컬렉션 (users/{userId}/history 서브컬렉션)
 * Chrome 확장에서 summary로 저장
 */
interface HistoryDocument {
  userId: string;
  title: string;
  url?: string;
  summary?: string;           // ✅ Chrome 확장에서 사용
  content?: string;           // ✅ 하위 호환성
  createdAt: Timestamp;
  deletedAt?: Timestamp | null;
  metadata?: {
    domain?: string;
    tags?: string[];
  };
}

/**
 * Daily 컬렉션 (users/{userId}/daily 서브컬렉션)
 */
interface DailyDocument {
  userId: string;
  date: string;               // YYYY-MM-DD
  count: number;
  isPremium: boolean;
  createdAt: Timestamp;
}

/**
 * Subscription 컬렉션 (최상위)
 */
interface SubscriptionDocument {
  userId: string;
  paddleSubscriptionId: string;
  paddleCustomerId: string;
  plan: 'free' | 'pro';
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'paused';
  currentPeriodEnd: Timestamp;
  nextBillingDate: Timestamp | null;
  cancelAtPeriodEnd: boolean;
  price: number;
  currency: string;
  priceId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 데이터 구조 예시

```
Firestore
│
├─ users (Collection)
│  └─ {userId} (Document)
│     ├─ email: "user@example.com"
│     ├─ name: "홍길동"
│     ├─ isPremium: true
│     ├─ photoURL: "https://..."
│     │
│     ├─ history (Subcollection) ⭐
│     │  └─ {historyId}
│     │     ├─ title: "Next.js 가이드"
│     │     ├─ summary: "요약 내용..."
│     │     ├─ url: "https://..."
│     │     ├─ createdAt: Timestamp
│     │     └─ metadata: {...}
│     │
│     └─ daily (Subcollection) ⭐
│        └─ {dailyId}
│           ├─ date: "2024-11-20"
│           ├─ count: 25
│           └─ isPremium: true
│
└─ subscription (Collection, 최상위)
   └─ {subscriptionId}
      ├─ userId: "user123"
      ├─ paddleSubscriptionId: "sub_01xxx"
      ├─ plan: "pro"
      └─ status: "active"
```

---

## 🔌 API 엔드포인트

### 인증 API

#### `POST /api/auth/session`
Firebase ID 토큰으로 세션 쿠키 생성 (5일 유효)

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session created successfully",
  "user": {
    "uid": "user123",
    "email": "user@example.com"
  }
}
```

**Headers:**
```
Set-Cookie: session=...; HttpOnly; Secure; Max-Age=432000
```

---

#### `GET /api/auth/session`
세션 쿠키 검증

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "uid": "user123",
    "email": "user@example.com"
  }
}
```

---

#### `DELETE /api/auth/session`
로그아웃 (세션 쿠키 삭제)

**Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

---

### 구독 관리 API

#### `POST /api/subscription/create`
Pro 플랜 구독 생성

**Headers:**
```
Authorization: Bearer {firebase-id-token}
```

**Request:**
```json
{
  "priceId": "pri_01xxx",
  "returnUrl": "https://your-domain.com/subscription?success=true"
}
```

**Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://buy.paddle.com/checkout/...",
  "transactionId": "txn_xxxxx"
}
```

---

#### `GET /api/subscription/status`
구독 상태 조회

**Headers:**
```
Authorization: Bearer {firebase-id-token}
```

**Response:**
```json
{
  "subscription": {
    "id": "sub_doc_id",
    "userId": "user123",
    "paddleSubscriptionId": "sub_01xxx",
    "plan": "pro",
    "status": "active",
    "currentPeriodEnd": "2024-12-15T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "nextBillingDate": "2024-12-15T00:00:00Z",
    "price": 9900,
    "currency": "KRW"
  }
}
```

---

#### `POST /api/subscription/sync` ⭐ NEW
구독 정보 수동 동기화 (Paddle API 직접 조회)

**Headers:**
```
Authorization: Bearer {firebase-id-token}
```

**Response:**
```json
{
  "success": true,
  "message": "구독 정보가 동기화되었습니다.",
  "subscription": {
    "status": "active",
    "currentPeriodEnd": "2024-12-15T00:00:00Z",
    "nextBillingDate": "2024-12-15T00:00:00Z",
    "daysUntilRenewal": 30,
    "isPremium": true
  }
}
```

**사용 시나리오:**
- 웹훅이 실패했을 때
- 구독 정보가 맞지 않을 때 ("0일 남음" 문제 등)
- 사용자가 문제를 신고했을 때

**프로세스:**
1. Firebase ID 토큰 검증
2. Firestore에서 사용자 구독 조회
3. **Paddle API에서 최신 구독 정보 가져오기** ⭐
4. Firestore `subscription` 업데이트
5. `users` 컬렉션 `isPremium` 업데이트
6. `daily` 컬렉션 (오늘 이후) 업데이트

---

#### `POST /api/subscription/cancel`
구독 취소 (다음 결제일까지 유지)

**Headers:**
```
Authorization: Bearer {firebase-id-token}
```

**Request:**
```json
{
  "effective": "next_billing_period"
}
```

**Response:**
```json
{
  "success": true,
  "message": "구독이 2024-12-31에 종료됩니다.",
  "subscription": {
    "status": "active",
    "cancelAtPeriodEnd": true,
    "currentPeriodEnd": "2024-12-31T23:59:59Z"
  }
}
```

---

#### `POST /api/subscription/resume`
취소 예정 구독 재개

**Headers:**
```
Authorization: Bearer {firebase-id-token}
```

**Response:**
```json
{
  "success": true,
  "message": "구독이 재개되었습니다.",
  "subscription": {
    "id": "sub_01xxx",
    "status": "active",
    "cancelAtPeriodEnd": false,
    "currentPeriodEnd": "2024-12-15T00:00:00Z",
    "nextBilledAt": "2024-12-15T00:00:00Z"
  }
}
```

---

#### `POST /api/subscription/update-payment`
결제 수단 변경 URL 생성

**Headers:**
```
Authorization: Bearer {firebase-id-token}
```

**Request:**
```json
{
  "returnUrl": "https://your-domain.com/subscription?payment_updated=true"
}
```

**Response:**
```json
{
  "success": true,
  "updateUrl": "https://buy.paddle.com/subscription/update/...",
  "message": "결제 수단 변경 페이지로 이동합니다."
}
```

---

### 웹훅 API

#### `POST /api/webhooks/paddle`
Paddle 웹훅 수신

**Headers:**
```
Paddle-Signature: ts=1234567890;h1=abc123...
```

**처리하는 이벤트:**
- `subscription.created` - 구독 생성
- `subscription.updated` - 구독 업데이트
- `subscription.canceled` - 구독 취소
- `subscription.past_due` - 결제 실패
- `subscription.paused` - 일시정지
- `subscription.resumed` - 재개
- `transaction.completed` - 결제 완료 (✅ **Paddle API 직접 조회** ⭐)

**프로세스 (transaction.completed):**
```typescript
// 1. 결제 기록 저장
await savePaymentRecord(data);

// 2. ✅ 구독 관련 결제인 경우 Paddle API에서 최신 정보 동기화
if (data.subscription_id) {
  const paddleSubscription = await getPaddleSubscription(data.subscription_id);
  
  // Firestore 업데이트
  await updateFirestoreSubscription(paddleSubscription);
  
  // users, daily 컬렉션도 업데이트
  await updateUserPremiumStatus(userId, isPremium);
}
```

**Response:**
```json
{
  "success": true
}
```

---

## 🌐 다국어 지원

### 지원 언어

- 🇰🇷 **한국어** (ko)
- 🇺🇸 **영어** (en)

### 사용 방법

#### 1. useTranslation 훅 사용

```tsx
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.home.title')}</h1>
      <p>{t('dashboard.home.greeting', { name: 'John' })}</p>
    </div>
  );
}
```

#### 2. 번역 파일 구조

```
messages/
├─ en.json
└─ ko.json
```

**예시 (messages/ko.json):**
```json
{
  "common": {
    "loading": "로딩 중...",
    "error": "오류가 발생했습니다"
  },
  "dashboard": {
    "home": {
      "title": "대시보드",
      "greeting": "안녕하세요, {name}님! 👋"
    }
  }
}
```

#### 3. 언어 전환

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

<LanguageSwitcher />
```

### 번역 추가하기

1. `messages/ko.json` 또는 `messages/en.json` 열기
2. 새로운 키 추가
3. 컴포넌트에서 `t('your.key')` 사용

---

## 🚢 배포

### Vercel 배포

#### 1. Vercel 연결

```bash
npm install -g vercel
vercel login
vercel
```

#### 2. 환경 변수 설정

Vercel Dashboard > 프로젝트 > Settings > Environment Variables

모든 `.env.local` 변수를 추가하되, **Production 환경에서는**:

```env
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_xxxxxxxxxxxxx
PADDLE_API_KEY=production-api-key
PADDLE_WEBHOOK_SECRET=production-webhook-secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### 3. 도메인 설정

1. Vercel Dashboard > Domains
2. Add Domain
3. DNS 설정

#### 4. Paddle Webhook URL 업데이트

Paddle Dashboard > Notifications에서 Webhook URL 변경:
```
https://your-domain.com/api/webhooks/paddle
```

---

## 🐛 트러블슈팅

### 1. Firebase 연결 오류

**증상:** `Error: Firebase: Error (auth/invalid-api-key)`

**해결:**
- `.env.local`의 `NEXT_PUBLIC_FIREBASE_API_KEY` 확인
- 개발 서버 재시작: `npm run dev`

---

### 2. Paddle Checkout이 열리지 않음

**증상:** `Error: Paddle is not initialized`

**해결:**
1. `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` 확인
2. `PaddleProvider`가 `app/layout.tsx`에 추가되어 있는지 확인
3. 브라우저 콘솔에서 `window.Paddle` 확인

---

### 3. 세션 쿠키 문제

**증상:** 로그인 후 새로고침 시 로그아웃됨

**해결:**
1. 브라우저가 쿠키를 차단하지 않는지 확인
2. 개발 환경에서 `secure: false` 확인
3. Middleware 로그 확인

---

### 4. 구독 갱신 후 "0일 남음" 문제 ⭐

**증상:** Pro 구독 중인데 "다음 결제까지 0일 남음"

**해결 (즉시):**
구독 관리 페이지에서 **"구독 정보 동기화"** 버튼 클릭

**해결 (근본):**
이미 적용됨 - `transaction.completed` 이벤트에서 Paddle API 직접 조회

---

### 5. Firestore 인덱스 필요

**증상:** `Error: 9 FAILED_PRECONDITION: The query requires an index`

**해결:**
에러 메시지의 링크를 클릭하여 Firebase Console에서 인덱스 자동 생성

---

### 6. 프로필 사진 업로드 실패

**증상:** `Error: User does not have permission`

**해결:**
1. Firebase Storage 보안 규칙 확인
2. 파일 크기 2MB 이하 확인
3. 이미지 파일 형식 확인 (JPEG, PNG, GIF, WebP)

---

## ✅ 개발 체크리스트

### Phase 1: 기반 구축 (완료 ✅)
- [x] Next.js 15 프로젝트 셋업
- [x] Firebase 연동
- [x] 인증 시스템
- [x] 대시보드 레이아웃

### Phase 2: 기록 관리 (완료 ✅)
- [x] 요약 기록 조회 (서브컬렉션)
- [x] 검색 및 필터링
- [x] 무한 스크롤
- [x] 반응형 디자인

### Phase 3: 결제 시스템 (완료 ✅)
- [x] Paddle Billing 연동
- [x] 구독 생성/취소/재개
- [x] 웹훅 처리
- [x] 결제 수단 변경

### Phase 4: 실시간 동기화 (완료 ✅)
- [x] 구독 상태 추적
- [x] Firestore 리스너
- [x] 웹훅 이벤트 로깅
- [x] **Paddle API 직접 조회** ⭐
- [x] **수동 구독 동기화** ⭐

### Phase 5: 최적화 & 추가 (완료 ✅)
- [x] **SEO 최적화** ⭐
- [x] **프로필 사진 업로드** ⭐
- [x] **보안 설정** ⭐
- [x] **다국어 지원 (한국어/영어)** ⭐
- [x] PWA 지원

### Phase 6: 고급 기능 (예정 📅)
- [ ] 팀 공유 기능
- [ ] 태그 관리 시스템
- [ ] PDF 내보내기
- [ ] API 키 발급
- [ ] 에러 모니터링 (Sentry)

---

## 🤝 기여하기

기여를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이센스

이 프로젝트는 **MIT 라이센스** 하에 배포됩니다.

```
MIT License

Copyright (c) 2025 SummaryGenie Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 📧 문의

- **이메일**: support@summarygenie.com
- **웹사이트**: https://summarygenie.app
- **GitHub**: https://github.com/your-username/summarygenie_page
- **이슈 트래커**: https://github.com/your-username/summarygenie_page/issues

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Paddle](https://www.paddle.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [SWR](https://swr.vercel.app/)

---

**Made with ❤️ by SummaryGenie Team**

*마지막 업데이트: 2025년 11월 20일*