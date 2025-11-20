// components/marketing/FinalCTA.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollReveal from './ScrollReveal';
import { useTranslation } from '@/hooks/useTranslation';

export default function FinalCTA() {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center space-y-8 text-white">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('marketing.finalCTA.title')}
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('marketing.finalCTA.subtitle')}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 py-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold mb-2">
                  {t('marketing.finalCTA.stats.users.number')}
                </div>
                <div className="text-blue-100 text-sm">
                  {t('marketing.finalCTA.stats.users.label')}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {t('marketing.finalCTA.stats.summaries.number')}
                </div>
                <div className="text-blue-100 text-sm">
                  {t('marketing.finalCTA.stats.summaries.label')}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">
                  {t('marketing.finalCTA.stats.rating.number')}
                </div>
                <div className="text-blue-100 text-sm">
                  {t('marketing.finalCTA.stats.rating.label')}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 gap-2"
                >
                  <Chrome className="w-5 h-5" />
                  {t('marketing.finalCTA.buttons.primary')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  {t('marketing.finalCTA.buttons.secondary')}
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t('marketing.finalCTA.badges.noCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t('marketing.finalCTA.badges.cancelAnytime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{t('marketing.finalCTA.badges.freeTrial')}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}