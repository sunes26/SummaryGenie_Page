// components/marketing/Pricing.tsx
'use client';

import Link from 'next/link';
import { Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollReveal from './ScrollReveal';
import { useTranslation } from '@/hooks/useTranslation';

export default function Pricing() {
  const { t } = useTranslation();

  const plans = [
    {
      name: t('marketing.pricing.free.name'),
      price: t('marketing.pricing.free.price'),
      period: t('marketing.pricing.free.period'),
      description: t('marketing.pricing.free.description'),
      features: [
        t('marketing.pricing.free.features.dailyLimit'),
        t('marketing.pricing.free.features.korean'),
        t('marketing.pricing.free.features.dashboard'),
      ],
      cta: t('marketing.pricing.free.cta'),
      href: '/signup',
      popular: false,
    },
    {
      name: t('marketing.pricing.pro.name'),
      price: t('marketing.pricing.pro.price'),
      period: t('marketing.pricing.pro.period'),
      description: t('marketing.pricing.pro.description'),
      features: [
        t('marketing.pricing.pro.features.unlimited'),
        t('marketing.pricing.pro.features.priority'),
        t('marketing.pricing.pro.features.unlimitedHistory'),
        t('marketing.pricing.pro.features.advancedQA'),
        t('marketing.pricing.pro.features.templates'),
        t('marketing.pricing.pro.features.pdf'),
      ],
      cta: t('marketing.pricing.pro.cta'),
      href: '/signup?plan=pro',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-slate-100 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('marketing.pricing.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('marketing.pricing.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div
                className={`relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all ${
                  plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                      <Crown className="w-4 h-4" />
                      <span>{t('marketing.pricing.pro.popular')}</span>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period !== t('marketing.pricing.free.period') && (
                      <span className="text-slate-600 dark:text-slate-400">/ {plan.period}</span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={plan.href}>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                        : ''
                    }`}
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}