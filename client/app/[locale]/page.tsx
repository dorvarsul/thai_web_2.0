import Hero from '@/components/Hero'
import CategoryNav from '@/components/CategoryNav'
import ProductGrid from '@/components/ProductGrid'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CategoryNav />
      <section className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="mb-12 text-center text-3xl font-extrabold tracking-tight md:text-4xl">המוצרים המובילים</h2>
        <ProductGrid />
      </section>
    </main>
  )
}