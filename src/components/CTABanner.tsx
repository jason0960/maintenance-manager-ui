import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CTABanner() {
  const { t } = useTranslation();

  return (
    <section className="bg-brand-600">
      <div className="container-max px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
          {t('cta.title')}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-brand-100">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/quote" className="btn-accent">
            {t('cta.button')} →
          </Link>
          <p className="text-brand-200">
            {t('cta.call')}{' '}
            <a href="tel:+12145550123" className="font-bold text-white underline">
              {t('contact.phoneNumber')}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
