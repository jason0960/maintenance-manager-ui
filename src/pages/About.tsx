import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import useFadeIn from '../hooks/useFadeIn';
import CTABanner from '../components/CTABanner';
import { IconClock, IconStar, IconBilingual, IconMapPin } from '../components/Icons';

export default function About() {
  const { t } = useTranslation();
  usePageTitle('nav.about');

  const [storyRef, storyVisible] = useFadeIn<HTMLDivElement>();
  const [valuesRef, valuesVisible] = useFadeIn<HTMLDivElement>();

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-600">
              {t('about.badge')}
            </span>
            <h1 className="mb-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              {t('about.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div
            ref={storyRef}
            className={`mx-auto max-w-3xl space-y-6 fade-in ${storyVisible ? 'visible' : ''}`}
          >
            <p className="text-lg leading-relaxed text-gray-600">{t('about.p1')}</p>
            <p className="text-lg leading-relaxed text-gray-600">{t('about.p2')}</p>
            <p className="text-lg leading-relaxed text-gray-600">{t('about.p3')}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div
            ref={valuesRef}
            className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-4 fade-in ${valuesVisible ? 'visible' : ''}`}
          >
            {[
              { icon: <IconClock className="h-8 w-8" />, title: t('about.value1Title'), desc: t('about.value1Desc'), color: 'bg-blue-100 text-blue-600' },
              { icon: <IconStar className="h-8 w-8" />, title: t('about.value2Title'), desc: t('about.value2Desc'), color: 'bg-amber-100 text-amber-600' },
              { icon: <IconBilingual className="h-8 w-8" />, title: t('about.value3Title'), desc: t('about.value3Desc'), color: 'bg-green-100 text-green-600' },
              { icon: <IconMapPin className="h-8 w-8" />, title: t('about.value4Title'), desc: t('about.value4Desc'), color: 'bg-purple-100 text-purple-600' },
            ].map((value) => (
              <div key={value.title} className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${value.color}`}>
                  {value.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container-max">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: t('hero.stat1Value'), label: t('hero.stat1Label') },
              { value: t('hero.stat2Value'), label: t('hero.stat2Label') },
              { value: t('hero.stat3Value'), label: t('hero.stat3Label') },
              { value: t('hero.stat4Value'), label: t('hero.stat4Label') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-brand-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('services.cta')}</h2>
          <Link to="/quote" className="btn-primary">
            {t('services.ctaButton')} →
          </Link>
        </div>
      </section>
    </>
  );
}
