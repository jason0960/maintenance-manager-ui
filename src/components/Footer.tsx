import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-max px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 font-bold text-white text-sm">
                S&E
              </div>
              <div>
                <span className="text-lg font-bold text-white">S and E</span>
                <span className="text-lg font-bold text-brand-400"> Reality</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/about', label: t('nav.about') },
                { path: '/services', label: t('nav.services') },
                { path: '/gallery', label: t('nav.gallery') },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.servicesTitle')}
            </h3>
            <ul className="space-y-2.5">
              <li className="text-sm text-gray-400">{t('services.remodeling')}</li>
              <li className="text-sm text-gray-400">{t('services.cleaning')}</li>
              <li className="text-sm text-gray-400">{t('services.makeready')}</li>
              <li className="text-sm text-gray-400">{t('services.painting')}</li>
              <li className="text-sm text-gray-400">{t('services.maintenance')}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.contactUs')}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="tel:+12145550123" className="text-sm text-gray-400 transition-colors hover:text-white">
                  📞 {t('contact.phoneNumber')}
                </a>
              </li>
              <li>
                <a href="mailto:info@sanderealtydallas.com" className="text-sm text-gray-400 transition-colors hover:text-white">
                  ✉️ {t('contact.emailAddress')}
                </a>
              </li>
              <li className="text-sm text-gray-400">📍 {t('contact.address')}</li>
              <li className="text-sm text-gray-400">🕐 {t('contact.hours')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {year} S & E Realty. {t('footer.rights')}
          </p>
          <p className="text-xs text-gray-600">
            {t('footer.builtWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}
