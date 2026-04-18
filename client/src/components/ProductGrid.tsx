import { createClient } from '@/src/lib/supabase-server'

type ProductCategory = {
  name: string
}

type ProductRow = {
  id: string
  name: string
  categories: ProductCategory | null
  price: number
}

export default async function ProductGrid() {
  const supabase = createClient()
  const { data: products } = await (await supabase)
    .from('products')
    .select('*, categories(name)')
    .eq('is_active', true)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {(products as ProductRow[] | null)?.map((product) => (
        <article
          key={product.id}
          className="cursor-pointer rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_35px_rgba(15,23,42,0.12)]"
        >
          <div className="mb-4 aspect-[3/4] rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100/60 flex items-center justify-center text-slate-400">
            תמונה
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">{product.name}</h3>
          <p className="mb-4 text-sm font-medium text-slate-500">{product.categories?.name}</p>
          <div className="flex justify-between items-center">
            <span className="text-xl font-black text-blue-700">₪{product.price}</span>
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700">
              הוספה לסל
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}