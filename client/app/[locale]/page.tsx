import Hero from '@/components/Hero'
import CategoryNav from '@/components/CategoryNav'
import ProductGrid from '@/components/ProductGrid'
import { routing } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'; // Use server-side translations

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Load translations for the "HomePage" namespace
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return (
    <main className="min-h-screen">
      <Hero />
      {/* Pass locale so the component knows which DB columns to fetch */}
      <CategoryNav locale={locale} />
      
      <section className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight md:text-4xl">
          {t('featuredProducts')} 
        </h2>
        <ProductGrid locale={locale} />
      </section>
    </main>
  )
}