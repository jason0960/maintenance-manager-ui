import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function usePageTitle(titleKey: string) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const base = 'S & E Realty';
    const pageTitle = t(titleKey);
    document.title = `${pageTitle} | ${base}`;

    return () => {
      document.title = base;
    };
  }, [titleKey, t, i18n.language]);
}
