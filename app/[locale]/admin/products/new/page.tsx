// app/[locale]/admin/products/new/page.tsx
import { createClient } from '@/lib/supabase-server';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  
  // Fetch categories to populate the dropdown
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name_th, name_he');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      {/* Just pass the data, not the upload function */}
      <ProductForm categories={categories || []} locale={locale} />
    </div>
  );
}