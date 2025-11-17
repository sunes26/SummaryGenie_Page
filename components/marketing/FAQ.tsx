// components/marketing/FAQ.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useTranslation } from '@/hooks/useTranslation';

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t('marketing.faq.q1.question'),
      answer: t('marketing.faq.q1.answer'),
    },
    {
      question: t('marketing.faq.q2.question'),
      answer: t('marketing.faq.q2.answer'),
    },
    {
      question: t('marketing.faq.q3.question'),
      answer: t('marketing.faq.q3.answer'),
    },
  ];

  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('marketing.faq.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {t('marketing.faq.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 50}>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="font-semibold text-lg pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {t('marketing.faq.needHelp')}
            </p>
            <a
              href={`mailto:${t('marketing.faq.contactEmail')}`}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {t('marketing.faq.contactEmail')}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}