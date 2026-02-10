import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import useFadeIn from '../hooks/useFadeIn';
import CTABanner from '../components/CTABanner';
import { IconCamera } from '../components/Icons';

export default function Gallery() {
  const { t } = useTranslation();
  usePageTitle('nav.gallery');

  const [gridRef, gridVisible] = useFadeIn<HTMLDivElement>();

  const projects = [
    { key: 'project1', color: 'from-blue-400 to-blue-600' },
    { key: 'project2', color: 'from-emerald-400 to-emerald-600' },
    { key: 'project3', color: 'from-purple-400 to-purple-600' },
    { key: 'project4', color: 'from-orange-400 to-orange-600' },
    { key: 'project5', color: 'from-pink-400 to-pink-600' },
    { key: 'project6', color: 'from-cyan-400 to-cyan-600' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-600">
              {t('gallery.badge')}
            </span>
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              {t('gallery.title')}
            </h1>
            <p className="text-lg text-gray-500">{t('gallery.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Placeholder grid — replace with real images later */}
          <div
            ref={gridRef}
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 fade-in ${gridVisible ? 'visible' : ''}`}
          >
            {projects.map((project) => (
              <div key={project.key} className="group overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Image placeholder */}
                <div className={`flex h-64 items-center justify-center bg-gradient-to-br ${project.color}`}>
                  <div className="text-center text-white">
                    <IconCamera className="mx-auto mb-2 h-12 w-12" />
                    <span className="text-sm font-medium opacity-80">{t('gallery.beforeAfter')}</span>
                  </div>
                </div>
                <div className="bg-white p-5">
                  <h3 className="text-base font-bold text-gray-900">
                    {t(`gallery.${project.key}`)}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Note */}
          <div className="mt-12 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-lg text-gray-500">{t('gallery.comingSoon')}</p>
            <Link to="/contact" className="btn-primary mt-4 inline-block">
              {t('nav.contact')} →
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
