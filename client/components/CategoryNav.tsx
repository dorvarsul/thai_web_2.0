import { createClient } from '../lib/supabase-server'
import { LayoutGrid, Utensils, Wine, Cookie, Leaf, Flame, type LucideIcon } from 'lucide-react'

type CategoryRow = {
  id: string
  name: string
  slug: string
}

const iconMap: Record<string, LucideIcon> = {
  'sauces': Utensils,
  'drinks': Wine,
  'snacks': Cookie,
  'noodles': Flame,
  'spices': Leaf,
}

// src/components/CategoryNav.tsx
export default async function CategoryNav() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <nav className="w-full overflow-hidden border-b border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="container mx-auto flex items-center justify-center gap-12 overflow-x-auto px-4 py-6 no-scrollbar">
        <CategoryItem name="כל המוצרים" Icon={LayoutGrid} />

        {categories?.map((cat: CategoryRow) => (
          <CategoryItem
            key={cat.id}
            name={cat.name}
            Icon={iconMap[cat.slug] || LayoutGrid}
          />
        ))}
      </div>
    </nav>
  )
}

function CategoryItem({ name, Icon }: { name: string; Icon: LucideIcon }) {
  return (
    <div className="group flex min-w-[88px] cursor-pointer flex-col items-center gap-3 transition-transform hover:-translate-y-1">
      {/* Circle changed to solid red, Icon to white */}
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-md transition-colors group-hover:bg-red-700">
        <Icon size={26} className="text-white" />
      </div>
      
      {/* Text hover changed from blue-600 to red-600 */}
      <span className="whitespace-nowrap text-sm font-bold text-slate-700 transition-colors group-hover:text-red-600">
        {name}
      </span>
    </div>
  )
}