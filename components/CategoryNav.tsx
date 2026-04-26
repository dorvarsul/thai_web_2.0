import { createClient } from '../lib/supabase-server';
import { getLocalizedField } from '@/lib/routing-helpers';
import { getTranslations } from 'next-intl/server'; 
import { 
  LayoutGrid, Utensils, Wine, Cookie, 
  Leaf, Flame, Sparkles, Box, HardDrive, 
  type LucideIcon 
} from 'lucide-react'
import { Link } from '@/i18n/routing';

type CategoryRow = {
  id: string
  name_th?: string 
  name_he?: string 
  slug: string
}

// Updated map to match your 8 categories exactly
const iconMap: Record<string, LucideIcon> = {
  'sauces': Utensils,
  'drinks': Wine,
  'snacks': Cookie,
  'noodles': Flame,
  'spices': Leaf,
  'cleaning': Sparkles,
  'canned': Box,
  'appliances': HardDrive,
}

export default async function CategoryNav({ locale }: { locale: string }) {
  const supabase = await createClient()
  const t = await getTranslations({ locale, namespace: 'Navigation' });
  
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, name_th, name_he') // Explicit selection
    .order('slug') // Ordering by slug is more stable than the 'name' column

  return (
    <nav className="w-full border-b border-slate-100 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-center gap-12 overflow-x-auto px-4 py-6 no-scrollbar">
        <CategoryItem name={t('allProducts')} Icon={LayoutGrid} href={`/products`} />

        {categories?.map((cat: CategoryRow) => (
          <CategoryItem
            key={cat.id}
            // Passing 'name' as the field name, helper will append _th or _he
            name={getLocalizedField(cat, 'name', locale)}
            Icon={iconMap[cat.slug] || LayoutGrid}
            href={`/categories/${cat.slug}`}
          />
        ))}
      </div>
    </nav>
  )
}

function CategoryItem({ name, Icon, href }: { name: string; Icon: LucideIcon; href: string }) {
  return (
    <Link 
      href={href} 
      className="group flex flex-shrink-0 w-20 md:w-24 cursor-pointer flex-col items-center gap-3 transition-transform hover:-translate-y-1 snap-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-md transition-colors group-hover:bg-red-700">
        <Icon size={26} className="text-white" />
      </div>
      <span className="text-center text-xs md:text-sm font-bold text-slate-700 transition-colors group-hover:text-red-600 leading-relaxed min-h-[2.5rem] flex items-start justify-center">
        {name}
      </span>
    </Link>
  )
}