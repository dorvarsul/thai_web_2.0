import { createClient } from '@/lib/supabase-server';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import BackButton from '@/components/BackButton'; // Import the new button
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getLocalizedField } from '@/lib/routing-helpers';

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string; slug: string }>,
  searchParams: Promise<{ q?: string }>
}) {
  const { slug, locale } = await params;
  const { q } = await searchParams;
  const supabase = await createClient();
  const t = await getTranslations({ locale, namespace: 'Categories' });

  // 1. Get Category
  const { data: category } = await supabase
    .from('categories')
    .select('id, name, name_he, name_th')
    .eq('slug', slug)
    .single();

  if (!category) return notFound();

  // 2. Build Search Query
  const searchColumn = locale === 'he' ? 'name_he' : 'name_th';
  let query = supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true);

  if (q) {
    query = query.ilike(searchColumn, `%${q}%`);
  }

  const { data: products } = await query;
  const localizedCategoryName = getLocalizedField(category, 'name', locale);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Back Button above the title */}
      <BackButton />

      {/* Stacked Header: Title then Search Bar */}
      <div className="flex flex-col gap-6 mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {localizedCategoryName}
        </h1>
        <div className="w-full max-w-md">
          <SearchBar
            key={`category-search-${slug}-${q ?? ''}`}
            placeholder={`${t('searchIn')} ${localizedCategoryName}...`}
            initialQuery={q ?? ''}
          />
        </div>
      </div>
      
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              locale={locale}
              product={{
                id: product.id,
                name: getLocalizedField(product, 'name', locale),
                price: Number(product.price),
                categoryName: localizedCategoryName,
                imageUrl: product.image_url,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 text-lg font-medium">
            {q ? `${t('noResults')} "${q}"` : t('emptyCategory')}
          </p>
        </div>
      )}
    </div>
  );
}