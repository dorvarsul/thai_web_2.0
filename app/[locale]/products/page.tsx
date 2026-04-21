import { createClient } from '@/lib/supabase-server';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { getTranslations } from 'next-intl/server';

export default async function AllProductsPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const supabase = await createClient();
  const t = await getTranslations({ locale, namespace: 'Products' });

  // Determine which database column to search based on locale
  const searchColumn = locale === 'he' ? 'name_he' : 'name_th';

  let query = supabase
    .from('products')
    .select('*, categories(name_he,name_th)')
    .eq('is_active', true);

  if (q) {
    // Search in the localized name column
    query = query.ilike(searchColumn, `%${q}%`);
  }

  const { data: rawProducts } = await query.order('created_at', { ascending: false });

  const products = rawProducts?.map((p) => ({
    ...p,
    // Map DB image URL to component imageURL
    imageUrl: p.image_url,
    categoryName: locale === 'he'? p.categories?.name_he : p.categories?.name_th,
    name: locale === 'he'? p.name_he:p.name_th
  }));

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-800">{t('allTitle')}</h1>
        <SearchBar key={`products-search-${q ?? ''}`} placeholder={t('searchPlaceholder')} initialQuery={q ?? ''} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
      
      {products?.length === 0 && (
        <p className="text-center text-slate-500 mt-20">{t('noResults')}</p>
      )}
    </main>
  );
}