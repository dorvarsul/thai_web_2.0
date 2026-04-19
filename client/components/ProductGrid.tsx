import { createClient } from '@/lib/supabase-server'
import ProductCard from './ProductCard'

type ProductCategory = {
  name: string
}

type ProductRow = {
  id: string
  name: string
  categories: ProductCategory | null
  price: number
  description: string | null
  image_url: string | null
}

export default async function ProductGrid() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_active', true)

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {(products as ProductRow[] | null)?.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            categoryName: product.categories?.name ?? null,
            imageUrl: product.image_url,
          }}
        />
      ))}
    </div>
  )
}