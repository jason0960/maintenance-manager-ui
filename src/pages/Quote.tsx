import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  propertyAddress: string;
  units: string;
  serviceType: string;
  details: string;
}

export default function Quote() {
  const { t } = useTranslation();
  usePageTitle('nav.quote');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const schema = yup.object({
    name: yup.string().required(t('validation.required')),
    email: yup.string().email(t('validation.emailInvalid')).required(t('validation.required')),
    phone: yup.string().required(t('validation.required')),
    company: yup.string().optional(),
    propertyAddress: yup.string().required(t('validation.required')),
    units: yup.string().required(t('validation.required')),
    serviceType: yup.string().required(t('validation.required')),
    details: yup.string().required(t('validation.required')),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (_data: QuoteFormData) => {
    setStatus('loading');
    try {
      // TODO: Replace with real API/email service
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const serviceOptions = [
    { value: 'remodeling', label: t('quote.serviceOptions.remodeling') },
    { value: 'cleaning', label: t('quote.serviceOptions.cleaning') },
    { value: 'makeready', label: t('quote.serviceOptions.makeready') },
    { value: 'painting', label: t('quote.serviceOptions.painting') },
    { value: 'maintenance', label: t('quote.serviceOptions.maintenance') },
    { value: 'other', label: t('quote.serviceOptions.other') },
  ];

  if (status === 'success') {
    return (
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="mx-auto max-w-lg rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">{t('quote.success')}</h2>
            <button onClick={() => setStatus('idle')} className="btn-primary mt-6">
              {t('quote.badge')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-600">
              {t('quote.badge')}
            </span>
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              {t('quote.title')}
            </h1>
            <p className="text-lg text-gray-500">{t('quote.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6">
            {/* Contact Info */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-8">
              <h3 className="mb-5 text-lg font-bold text-gray-900">{t('contact.infoTitle')}</h3>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('quote.name')}</label>
                  <input {...register('name')} placeholder={t('quote.namePlaceholder')} className={`input-field ${errors.name ? 'input-error' : ''}`} />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('quote.email')}</label>
                    <input {...register('email')} type="email" placeholder={t('quote.emailPlaceholder')} className={`input-field ${errors.email ? 'input-error' : ''}`} />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('quote.phone')}</label>
                    <input {...register('phone')} placeholder={t('quote.phonePlaceholder')} className={`input-field ${errors.phone ? 'input-error' : ''}`} />
                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('quote.company')}</label>
                  <input {...register('company')} placeholder={t('quote.companyPlaceholder')} className="input-field" />
                </div>
              </div>
            </div>

            {/* Property Info */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-8">
              <h3 className="mb-5 text-lg font-bold text-gray-900">{t('quote.propertyAddress')}</h3>
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('quote.propertyAddress')}</label>
                  <input {...register('propertyAddress')} placeholder={t('quote.propertyAddressPlaceholder')} className={`input-field ${errors.propertyAddress ? 'input-error' : ''}`} />
                  {errors.propertyAddress && <p className="mt-1 text-sm text-red-500">{errors.propertyAddress.message}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('quote.units')}</label>
                    <input {...register('units')} placeholder={t('quote.unitsPlaceholder')} className={`input-field ${errors.units ? 'input-error' : ''}`} />
                    {errors.units && <p className="mt-1 text-sm text-red-500">{errors.units.message}</p>}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('quote.serviceType')}</label>
                    <select {...register('serviceType')} className={`input-field ${errors.serviceType ? 'input-error' : ''}`}>
                      <option value="">—</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.serviceType && <p className="mt-1 text-sm text-red-500">{errors.serviceType.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('quote.details')}</label>
                  <textarea {...register('details')} rows={5} placeholder={t('quote.detailsPlaceholder')} className={`input-field resize-none ${errors.details ? 'input-error' : ''}`} />
                  {errors.details && <p className="mt-1 text-sm text-red-500">{errors.details.message}</p>}
                </div>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {t('quote.error')}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t('quote.submitting')}
                </span>
              ) : (
                <>{t('quote.submit')} →</>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
