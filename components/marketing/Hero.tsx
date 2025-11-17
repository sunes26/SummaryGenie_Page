// components/marketing/Hero.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Chrome, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300">
            <Zap className="w-4 h-4" />
            <span>{t('marketing.hero.badge')}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {t('marketing.hero.title1')}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('marketing.hero.title2')}
            </span>
            <br />
            {t('marketing.hero.title3')}{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('marketing.hero.title4')}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t('marketing.hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 gap-2">
                <Chrome className="w-5 h-5" />
                {t('marketing.hero.ctaPrimary')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                {t('marketing.hero.ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {t('marketing.hero.stats.users')}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-purple-600">100K+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {t('marketing.hero.stats.summaries')}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-pink-600">50%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {t('marketing.hero.stats.timeSaved')}
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="pt-12">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Chrome className="w-16 h-16 mx-auto text-slate-400" />
                    <p className="text-slate-500 dark:text-slate-400">
                      Chrome Extension Demo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}