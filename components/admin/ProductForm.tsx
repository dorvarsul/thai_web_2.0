'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProduct } from '@/lib/actions/admin-products';
import { ProductInput } from '@/lib/product-validation';

interface Props {
  initialData?: Partial<ProductInput>;
  categories: { id: string; name_th: string; name_he: string }[];
  locale: string;
}

export default function ProductForm({ initialData, categories, locale }: Props) {
  const router = useRouter();
  const safeLocale = locale || 'he';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const rawData = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, typeof value === 'string' ? value : ''])
    ) as Record<string, string>;
    
    if (initialData?.id) {
      rawData.id = initialData.id;
    }

    const result = await upsertProduct(rawData);

    if (result?.error) {
      // Result.error can be a Zod error object or a string
      setError(typeof result.error === 'string' ? result.error : 'Validation Error: Please check all fields.');
      setLoading(false);
    } else {
      router.push(`/${safeLocale}/admin/products`);
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-5xl">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Primary Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select 
            name="category_id" 
            defaultValue={initialData?.category_id} 
            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name_th} / {cat.name_he}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Price (ILS)</label>
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            defaultValue={initialData?.price} 
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
          <input 
            name="stock_quantity" 
            type="number" 
            defaultValue={initialData?.stock_quantity} 
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" 
            required 
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Multilingual Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Thai Column */}
        <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800 flex items-center gap-2">
            🇹🇭 Thai Content (optional)
          </h3>
          <div>
            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Product Name (optional)</label>
            <input 
              name="name_th" 
              placeholder="ชื่อสินค้า" 
              defaultValue={initialData?.name_th} 
              className="w-full border border-blue-200 rounded-lg p-2.5 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Description (optional)</label>
            <textarea 
              name="description_th" 
              placeholder="คำอธิบายสินค้า..." 
              defaultValue={initialData?.description_th} 
              className="w-full border border-blue-200 rounded-lg p-2.5 h-40 focus:border-blue-500 outline-none" 
            />
          </div>
        </div>

        {/* Hebrew Column */}
        <div className="space-y-4 p-4 bg-red-50/30 rounded-lg border border-red-100">
          <h3 className="font-bold text-red-800 flex items-center gap-2 justify-end">
            Hebrew Content 🇮🇱
          </h3>
          <div>
            <label className="block text-xs font-bold text-red-600 uppercase mb-1 text-right">שם המוצר</label>
            <input 
              name="name_he" 
              placeholder="שם המוצר" 
              defaultValue={initialData?.name_he} 
              className="w-full border border-red-200 rounded-lg p-2.5 text-right focus:border-red-500 outline-none" 
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-red-600 uppercase mb-1 text-right">תיאור</label>
            <textarea 
              name="description_he" 
              placeholder="תיאור המוצר..." 
              defaultValue={initialData?.description_he} 
              className="w-full border border-red-200 rounded-lg p-2.5 h-40 text-right focus:border-red-500 outline-none" 
              dir="rtl"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-slate-900 text-white px-10 py-2.5 rounded-lg font-bold hover:bg-black disabled:opacity-50 shadow-lg shadow-gray-200 transition-all active:scale-95"
        >
          {loading ? 'Processing...' : (initialData?.id ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}