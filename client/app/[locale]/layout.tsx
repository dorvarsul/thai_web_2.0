import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import NavBar from '@/components/NavBar';

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Thai Market | תאי מרקט",
  description: "Thai e-commerce storefront",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const direction = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <NextIntlClientProvider messages={messages}>
      <div className={heebo.variable} lang={locale} dir={direction}>
        <NavBar locale={locale} />
        {children}
      </div>
    </NextIntlClientProvider>
  );
}