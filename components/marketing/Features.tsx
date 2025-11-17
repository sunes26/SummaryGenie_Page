// components/marketing/Features.tsx
'use client';

import { Sparkles, MessageSquare, Languages, Zap, Shield, Smartphone } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useTranslation } from '@/hooks/useTranslation';

export default function Features() {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      icon: Sparkles,
      title: t('marketing.features.aiSummary.title'),
      description: t('marketing.features.aiSummary.description'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: t('marketing.features.smartQA.title'),
      description: t('marketing.features.smartQA.description'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Languages,
      title: t('marketing.features.koreanSupport.title'),
      description: t('marketing.features.koreanSupport.description'),
      color: 'from-orange-500 to-red-500',
    },
  ];

  const additionalFeatures = [
    {
      icon: Zap,
      title: t('marketing.features.fastProcessing.title'),
      description: t('marketing.features.fastProcessing.description'),
    },
    {
      icon: Shield,
      title: t('marketing.features.privacy.title'),
      description: t('marketing.features.privacy.description'),
    },
    {
      icon: Smartphone,
      title: t('marketing.features.access.title'),
      description: t('marketing.features.access.description'),
    },
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t('marketing.features.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('marketing.features.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Additional Features */}
        <ScrollReveal delay={300}>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}