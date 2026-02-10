import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import usePageTitle from '../hooks/usePageTitle';
import useFadeIn from '../hooks/useFadeIn';
import { IconPhone, IconMail, IconMapPin, IconClock } from '../components/Icons';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contact() {
  const { t } = useTranslation();
  usePageTitle('nav.contact');
  const [formRef, formVisible] = useFadeIn<HTMLDivElement>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const schema = yup.object({
    name: yup.string().required(t('validation.required')),
    email: yup.string().email(t('validation.emailInvalid')).required(t('validation.required')),
    phone: yup.string().required(t('validation.required')),
    message: yup.string().required(t('validation.required')),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (_data: ContactFormData) => {
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

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-brand-600">
              {t('contact.badge')}
            </span>
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              {t('contact.title')}
            </h1>
            <p className="text-lg text-gray-500">{t('contact.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div ref={formRef} className={`grid gap-12 lg:grid-cols-5 fade-in ${formVisible ? 'visible' : ''}`}>
            {/* Form */}
            <div className="lg:col-span-3">
              {status === 'success' ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{t('contact.success')}</h3>
                  <button onClick={() => setStatus('idle')} className="btn-primary mt-4">
                    {t('contact.badge')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('contact.name')}</label>
                    <input {...register('name')} placeholder={t('contact.namePlaceholder')} className={`input-field ${errors.name ? 'input-error' : ''}`} />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('contact.email')}</label>
                      <input {...register('email')} type="email" placeholder={t('contact.emailPlaceholder')} className={`input-field ${errors.email ? 'input-error' : ''}`} />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('contact.phone')}</label>
                      <input {...register('phone')} placeholder={t('contact.phonePlaceholder')} className={`input-field ${errors.phone ? 'input-error' : ''}`} />
                      {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-700">{t('contact.message')}</label>
                    <textarea {...register('message')} rows={5} placeholder={t('contact.messagePlaceholder')} className={`input-field resize-none ${errors.message ? 'input-error' : ''}`} />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                  </div>

                  {status === 'error' && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                      {t('contact.error')}
                    </div>
                  )}

                  <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto">
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t('contact.submitting')}
                      </span>
                    ) : (
                      t('contact.submit')
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-gray-50 p-8 border border-gray-100">
                <h3 className="mb-6 text-lg font-bold text-gray-900">{t('contact.infoTitle')}</h3>
                <div className="space-y-5">
                  <a href="tel:+12145550123" className="flex items-start gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-200">
                      <IconPhone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('contact.phone')}</p>
                      <p className="font-semibold text-gray-900">{t('contact.phoneNumber')}</p>
                    </div>
                  </a>

                  <a href="mailto:info@sanderealtydallas.com" className="flex items-start gap-4 group">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-200">
                      <IconMail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('contact.email')}</p>
                      <p className="font-semibold text-gray-900">{t('contact.emailAddress')}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                      <IconMapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('contact.badge')}</p>
                      <p className="font-semibold text-gray-900">{t('contact.address')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                      <IconClock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('contact.hours')}</p>
                      <p className="text-sm font-medium text-green-600">{t('contact.emergency')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Embed */}
      <section className="bg-white pb-0">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <h3 className="mb-4 text-center text-lg font-bold text-gray-900">{t('contact.findUs')}</h3>
        </div>
        <iframe
          title="S & E Realty — Dallas, TX"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d214587.22474994025!2d-96.87194674609375!3d32.82058565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c19f77b45974b%3A0xb9ec9ba4f647678f!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1700000000000"
          className="h-80 w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
