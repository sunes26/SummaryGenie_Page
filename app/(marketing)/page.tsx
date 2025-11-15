// app/(marketing)/page.tsx
import { Suspense, lazy } from 'react';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import Hero from '@/components/marketing/Hero';

// ✅ Dynamic Import: 뷰포트에 들어올 때만 로드
const ProblemStatement = lazy(() => import('@/components/marketing/ProblemStatement'));
const Features = lazy(() => import('@/components/marketing/Features'));
const HowItWorks = lazy(() => import('@/components/marketing/HowItWorks'));
const UseCases = lazy(() => import('@/components/marketing/UseCases'));
const Pricing = lazy(() => import('@/components/marketing/Pricing'));
const FAQ = lazy(() => import('@/components/marketing/FAQ'));
const FinalCTA = lazy(() => import('@/components/marketing/FinalCTA'));

// ✅ 로딩 스켈레톤 컴포넌트
function SectionSkeleton() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header - 즉시 로드 */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section - 즉시 로드 (Above the fold) */}
        <Hero />

        {/* ✅ Below the fold 컴포넌트들은 Suspense로 감싸기 */}
        
        {/* Problem Statement */}
        <Suspense fallback={<SectionSkeleton />}>
          <ProblemStatement />
        </Suspense>

        {/* Features */}
        <Suspense fallback={<SectionSkeleton />}>
          <Features />
        </Suspense>

        {/* How It Works */}
        <Suspense fallback={<SectionSkeleton />}>
          <HowItWorks />
        </Suspense>

        {/* Use Cases */}
        <Suspense fallback={<SectionSkeleton />}>
          <UseCases />
        </Suspense>

        {/* Pricing */}
        <Suspense fallback={<SectionSkeleton />}>
          <Pricing />
        </Suspense>

        {/* FAQ */}
        <Suspense fallback={<SectionSkeleton />}>
          <FAQ />
        </Suspense>

        {/* Final CTA */}
        <Suspense fallback={<SectionSkeleton />}>
          <FinalCTA />
        </Suspense>
      </main>

      {/* Footer - 지연 로드 가능 */}
      <Footer />
    </div>
  );
}