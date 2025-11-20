// components/marketing/HowItWorks.tsx
'use client';

import { Download, MousePointerClick, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useTranslation } from '@/hooks/useTranslation';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      icon: Download,
      title: t('marketing.howItWorks.step1.title'),
      description: t('marketing.howItWorks.step1.description'),
    },
    {
      number: '02',
      icon: MousePointerClick,
      title: t('marketing.howItWorks.step2.title'),
      description: t('marketing.howItWorks.step2.description'),
    },
    {
      number: '03',
      icon: Sparkles,
      title: t('marketing.howItWorks.step3.title'),
      description: t('marketing.howItWorks.step3.description'),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-slate-100 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('marketing.howItWorks.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('marketing.howItWorks.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 -translate-y-1/2 opacity-20" />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <div className="relative">
                  {/* Step Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    {/* Step Number */}
                    <div className="text-6xl font-bold text-slate-200 dark:text-slate-700 mb-4">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow (Desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 translate-x-full z-10">
                      <svg
                        className="w-8 h-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal delay={400}>
          <div className="mt-16 text-center">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              {t('marketing.howItWorks.footer.text')}
            </p>
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <Download className="w-5 h-5" />
              {t('marketing.howItWorks.footer.cta')}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}