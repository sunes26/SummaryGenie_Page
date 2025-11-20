// components/marketing/UseCases.tsx
'use client';

import { GraduationCap, Briefcase, Newspaper } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useTranslation } from '@/hooks/useTranslation';

export default function UseCases() {
  const { t } = useTranslation();

  const cases = [
    {
      icon: GraduationCap,
      title: t('marketing.useCases.case1.title'),
      description: t('marketing.useCases.case1.description'),
      benefits: [
        t('marketing.useCases.case1.benefit1'),
        t('marketing.useCases.case1.benefit2'),
        t('marketing.useCases.case1.benefit3'),
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Briefcase,
      title: t('marketing.useCases.case2.title'),
      description: t('marketing.useCases.case2.description'),
      benefits: [
        t('marketing.useCases.case2.benefit1'),
        t('marketing.useCases.case2.benefit2'),
        t('marketing.useCases.case2.benefit3'),
      ],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Newspaper,
      title: t('marketing.useCases.case3.title'),
      description: t('marketing.useCases.case3.description'),
      benefits: [
        t('marketing.useCases.case3.benefit1'),
        t('marketing.useCases.case3.benefit2'),
        t('marketing.useCases.case3.benefit3'),
      ],
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('marketing.useCases.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('marketing.useCases.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((useCase, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                {/* Icon */}
                <div className={`w-16 h-16 ${useCase.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${useCase.color} rounded-lg flex items-center justify-center`}>
                    <useCase.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {useCase.description}
                </p>

                {/* Benefits */}
                <div className="space-y-3">
                  {useCase.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${useCase.color}`} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">
              {t('marketing.useCases.cta.title')}
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('marketing.useCases.cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-left">
              <div>
                <div className="text-4xl font-bold">
                  {t('marketing.useCases.cta.stat1.number')}
                </div>
                <div className="text-blue-100">
                  {t('marketing.useCases.cta.stat1.label')}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold">
                  {t('marketing.useCases.cta.stat2.number')}
                </div>
                <div className="text-blue-100">
                  {t('marketing.useCases.cta.stat2.label')}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold">
                  {t('marketing.useCases.cta.stat3.number')}
                </div>
                <div className="text-blue-100">
                  {t('marketing.useCases.cta.stat3.label')}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}