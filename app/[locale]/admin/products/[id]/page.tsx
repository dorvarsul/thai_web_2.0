import { createClient } from '@/lib/supabase-server';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';
import { translateText } from '@/lib/google-translate';

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string; locale: string }> 
}) {
  const { id, locale } = await params;
  const supabase = await createClient();
  
  const [productRes, catRes] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name_th, name_he')
  ]);

  if (!productRes.data) notFound();

  const product = productRes.data;
  const [translatedNameTh, translatedDescriptionTh] = await Promise.all([
    product.name_th?.trim() ? Promise.resolve(product.name_th) : translateText(product.name_he ?? '', 'th', 'he'),
    product.description_th?.trim()
      ? Promise.resolve(product.description_th)
      : translateText(product.description_he ?? '', 'th', 'he'),
  ]);

  const hydratedProduct = {
    ...product,
    name_th: translatedNameTh ?? product.name_th ?? '',
    description_th: translatedDescriptionTh ?? product.description_th ?? '',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product: {hydratedProduct.name_he}</h1>
      <ProductForm 
        initialData={hydratedProduct} 
        categories={catRes.data || []} 
        locale={locale} 
      />
    </div>
  );
}