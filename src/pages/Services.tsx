import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import useFadeIn from '../hooks/useFadeIn';
import CTABanner from '../components/CTABanner';
import {
  IconRemodeling, IconCleaning, IconMakeReady, IconPainting, IconMaintenance,
} from '../components/Icons';
import { type ReactNode } from 'react';

const serviceIcons: Record<string, ReactNode> = {
  remodeling: <IconRemodeling className="h-16 w-16 text-white/90" />,
  cleaning: <IconCleaning className="h-16 w-16 text-white/90" />,
  makeready: <IconMakeReady className="h-16 w-16 text-white/90" />,
  painting: <IconPainting className="h-16 w-16 text-white/90" />,
  maintenance: <IconMaintenance className="h-16 w-16 text-white/90" />,
};

const serviceColors: Record<string, string> = {
  remodeling: 'from-blue-500 to-blue-600',
  cleaning: 'from-emerald-500 to-emerald-600',
  makeready: 'from-orange-500 to-orange-600',
  painting: 'from-purple-500 to-purple-600',
  maintenance: 'from-red-500 to-red-600',
};

export default function Services() {
  const { t } = useTranslation();
  usePageTitle('nav.services');

  const [listRef, listVisible] = useFadeIn<HTMLDivElement>();

  const services = [
    { key: 'remodeling', title: t('services.remodeling'), desc: t('services.remodelingDesc') },
    { key: 'cleaning', title: t('services.cleaning'), desc: t('services.cleaningDesc') },
    { key: 'makeready', title: t('services.makeready'), desc: t('services.makereadyDesc') },
    { key: 'painting', title: t('services.painting'), desc: t('services.paintingDesc') },
    { key: 'maintenance', title: t('services.maintenance'), desc: t('services.maintenanceDesc') },
  ];

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-600">
              {t('services.badge')}
            </span>
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              {t('services.title')}
            </h1>
            <p className="text-lg text-gray-500">{t('services.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div ref={listRef} className={`space-y-16 fade-in ${listVisible ? 'visible' : ''}`}>
            {services.map((service, i) => (
              <div
                key={service.key}
                className={`flex flex-col items-center gap-8 lg:flex-row ${
                  i % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Icon Placeholder */}
                <div className="flex w-full items-center justify-center lg:w-5/12">
                  <div className={`flex h-48 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${serviceColors[service.key]} shadow-xl`}>
                    {serviceIcons[service.key]}
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-7/12">
                  <h2 className="mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {service.title}
                  </h2>
                  <p className="mb-6 text-lg leading-relaxed text-gray-500">
                    {service.desc}
                  </p>
                  <Link to="/quote" className="btn-primary">
                    {t('services.ctaButton')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABanner />
    </>
  );
}
