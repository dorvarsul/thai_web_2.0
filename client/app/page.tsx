import Hero from '@/src/components/Hero'
import CategoryNav from '@/src/components/CategoryNav'
import ProductGrid from '@/src/components/ProductGrid'

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