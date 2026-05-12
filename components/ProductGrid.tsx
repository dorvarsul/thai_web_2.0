import { createClient } from '@/lib/supabase-server'
import { getLocalizedField } from '@/lib/routing-helpers'
import ProductCard from './ProductCard'

type ProductRow = {
  id: string
  name: string
  name_th?: string
  name_he?: string
  categories:
    | {
        id: string
        name?: string
        name_th?: string
        name_he?: string
      }
    | null
  price: number
  description: string | null
  description_th?: string
  description_he?: string
  image_url: string | null
}

export default async function ProductGrid({ locale }: { locale: string }) {
  const supabase = await createClient()
  
  // Select all columns to ensure localized versions are fetched
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(*)') 
    .eq('is_active', true)
    .eq('is_featured', true)

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {(products as ProductRow[] | null)?.map((product) => (
        <ProductCard
          key={product.id}
          locale={locale} // Pass locale to the card
          product={{
            id: product.id,
            // Localize the product name here or inside ProductCard
            name: getLocalizedField(product, 'name', locale),
            price: Number(product.price),
            // Localize the category name from the joined table
            categoryName: product.categories 
              ? getLocalizedField(product.categories, 'name', locale) 
              : null,
            imageUrl: product.image_url,
          }}
        />
      ))}
    </div>
  )
}