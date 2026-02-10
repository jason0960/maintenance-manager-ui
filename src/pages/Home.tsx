import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import useFadeIn from '../hooks/useFadeIn';
import CTABanner from '../components/CTABanner';
import {
  IconRemodeling, IconCleaning, IconMakeReady, IconPainting, IconMaintenance,
  IconClock, IconStar, IconBilingual, IconMapPin,
} from '../components/Icons';

export default function Home() {
  const { t } = useTranslation();
  usePageTitle('nav.home');

  const [servicesRef, servicesVisible] = useFadeIn<HTMLDivElement>();
  const [valuesRef, valuesVisible] = useFadeIn<HTMLDivElement>();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-brand-950 to-gray-900">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-500 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-accent-500 blur-[100px]" />
        </div>

        <div className="container-max relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-4 py-1.5 text-sm font-medium text-brand-300 ring-1 ring-brand-500/30">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
              {t('hero.badge')}
            </div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
              {t('hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/quote" className="btn-accent w-full sm:w-auto">
                {t('hero.cta')} →
              </Link>
              <Link to="/services" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/10 sm:w-auto">
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:mt-20 sm:grid-cols-4">
            {[
              { value: t('hero.stat1Value'), label: t('hero.stat1Label') },
              { value: t('hero.stat2Value'), label: t('hero.stat2Label') },
              { value: t('hero.stat3Value'), label: t('hero.stat3Label') },
              { value: t('hero.stat4Value'), label: t('hero.stat4Label') },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/5 p-6 text-center ring-1 ring-white/10 backdrop-blur">
                <p className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-600">
              {t('services.badge')}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('services.title')}
            </h2>
            <p className="text-lg text-gray-500">{t('services.subtitle')}</p>
          </div>

          <div
            ref={servicesRef}
            className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 fade-in ${servicesVisible ? 'visible' : ''}`}
          >
            {[
              { icon: <IconRemodeling className="h-8 w-8" />, title: t('services.remodeling'), desc: t('services.remodelingDesc'), color: 'bg-blue-100 text-blue-600' },
              { icon: <IconCleaning className="h-8 w-8" />, title: t('services.cleaning'), desc: t('services.cleaningDesc'), color: 'bg-emerald-100 text-emerald-600' },
              { icon: <IconMakeReady className="h-8 w-8" />, title: t('services.makeready'), desc: t('services.makereadyDesc'), color: 'bg-orange-100 text-orange-600' },
              { icon: <IconPainting className="h-8 w-8" />, title: t('services.painting'), desc: t('services.paintingDesc'), color: 'bg-purple-100 text-purple-600' },
              { icon: <IconMaintenance className="h-8 w-8" />, title: t('services.maintenance'), desc: t('services.maintenanceDesc'), color: 'bg-red-100 text-red-600' },
            ].map((service) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50 hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${service.color}`}>
                  {service.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{service.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{service.desc}</p>
              </div>
            ))}

            {/* CTA Card */}
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-8 text-center">
              <p className="mb-4 text-lg font-bold text-brand-800">{t('services.cta')}</p>
              <Link to="/quote" className="btn-primary">
                {t('services.ctaButton')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values / Why Us */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-600">
              {t('about.badge')}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              {t('about.title')}
            </h2>
          </div>

          <div
            ref={valuesRef}
            className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-4 fade-in ${valuesVisible ? 'visible' : ''}`}
          >
            {[
              { icon: <IconClock className="h-7 w-7" />, title: t('about.value1Title'), desc: t('about.value1Desc'), color: 'bg-blue-100 text-blue-600' },
              { icon: <IconStar className="h-7 w-7" />, title: t('about.value2Title'), desc: t('about.value2Desc'), color: 'bg-amber-100 text-amber-600' },
              { icon: <IconBilingual className="h-7 w-7" />, title: t('about.value3Title'), desc: t('about.value3Desc'), color: 'bg-green-100 text-green-600' },
              { icon: <IconMapPin className="h-7 w-7" />, title: t('about.value4Title'), desc: t('about.value4Desc'), color: 'bg-purple-100 text-purple-600' },
            ].map((value) => (
              <div key={value.title} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl ${value.color}`}>
                  {value.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/about" className="btn-secondary">
              {t('nav.about')} →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
