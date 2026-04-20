import { defineRouting } from 'next-intl/routing';

export const locales = ['he', 'th'] as const;

export const routing = defineRouting({
  locales,
  defaultLocale: 'he',
  localePrefix: 'always',
});