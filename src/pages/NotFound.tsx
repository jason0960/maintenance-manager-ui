import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language === 'es';

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-7xl font-extrabold text-brand-600">404</p>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">
        {isEs ? 'Página no encontrada' : 'Page Not Found'}
      </h1>
      <p className="mb-8 max-w-md text-gray-500">
        {isEs
          ? 'La página que busca no existe o ha sido movida.'
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link to="/" className="btn-primary">
        {t('nav.home')} →
      </Link>
    </section>
  );
}
