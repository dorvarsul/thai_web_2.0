import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './i18n/routing';

export default getRequestConfig(async ({ locale }) => {
    if (!locale || !locales.includes(locale as (typeof locales)[number])) notFound();

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
    };
});