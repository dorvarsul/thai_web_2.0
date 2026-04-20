import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export default async function AdminProductsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <div>Error loading products: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link 
          href={`/${locale}/admin/products/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-sm uppercase text-gray-600">
              <th className="p-4 font-semibold">Name (TH / HE)</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{product.name_th}</div>
                  <div className="text-xs text-gray-400" dir="rtl">{product.name_he}</div>
                </td>
                <td className="p-4">₪{product.price}</td>
                <td className="p-4 text-right space-x-4">
                  <Link 
                    href={`/${locale}/admin/products/${product.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton id={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}