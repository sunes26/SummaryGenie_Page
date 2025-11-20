// components/marketing/ProblemStatement.tsx
'use client';

import { AlertCircle, Clock, BookOpen, Brain } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProblemStatement() {
  const { t } = useTranslation();

  const problems = [
    {
      icon: Clock,
      title: t('marketing.problemStatement.problem1.title'),
      description: t('marketing.problemStatement.problem1.description'),
    },
    {
      icon: BookOpen,
      title: t('marketing.problemStatement.problem2.title'),
      description: t('marketing.problemStatement.problem2.description'),
    },
    {
      icon: Brain,
      title: t('marketing.problemStatement.problem3.title'),
      description: t('marketing.problemStatement.problem3.description'),
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-100 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-sm font-medium text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4" />
              <span>{t('marketing.problemStatement.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('marketing.problemStatement.title')}
              <br />
              <span className="text-slate-600 dark:text-slate-400">
                {t('marketing.problemStatement.subtitle')}
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-6">
                  <problem.icon className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{problem.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 max-w-3xl">
              <p className="text-2xl font-semibold text-white">
                {t('marketing.problemStatement.quote.question')}
              </p>
              <p className="mt-4 text-blue-100">
                {t('marketing.problemStatement.quote.answer')}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}