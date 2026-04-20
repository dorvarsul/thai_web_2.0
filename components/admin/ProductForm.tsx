'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProduct } from '@/lib/actions/admin-products';
import { ProductInput } from '@/lib/product-validation';
import { createClient } from '@/lib/supabase-client'; // Ensure this points to your BROWSER client helper

interface Props {
  initialData?: Partial<ProductInput>;
  categories: { id: string; name_th: string; name_he: string }[];
  locale: string;
}

export default function ProductForm({ initialData, categories, locale }: Props) {
  const router = useRouter();
  const supabase = createClient(); // Client-side instance
  const safeLocale = locale || 'he';
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track the image URL in state
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const rawData = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, typeof value === 'string' ? value : ''])
    ) as Record<string, string>;
    
    // Inject the image URL from state into the data sent to the Server Action
    rawData.image_url = imageUrl;

    if (initialData?.id) {
      rawData.id = initialData.id;
    }

    const result = await upsertProduct(rawData);

    if (result?.error) {
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

      {/* Image Upload Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
        <label className="block text-sm font-semibold text-gray-700 mb-4">Product Image</label>
        <div className="flex items-center gap-6">
          {imageUrl && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border bg-white">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              disabled={uploading}
            />
            <p className="mt-2 text-xs text-gray-500">
              {uploading ? 'Uploading image...' : 'PNG, JPG or WEBP. Max 2MB.'}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select 
            name="category_id" 
            defaultValue={initialData?.category_id} 
            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name_he} / {cat.name_th}
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
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

      {/* Multilingual Content Section (Existing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Thai Column */}
        <div className="space-y-4 p-4 bg-blue-50/30 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800 flex items-center gap-2">🇹🇭 Thai Content</h3>
          <input name="name_th" placeholder="ชื่อสินค้า" defaultValue={initialData?.name_th} className="w-full border border-blue-200 rounded-lg p-2.5 focus:border-blue-500 outline-none" />
          <textarea name="description_th" placeholder="คำอธิบายสินค้า..." defaultValue={initialData?.description_th} className="w-full border border-blue-200 rounded-lg p-2.5 h-40 focus:border-blue-500 outline-none" />
        </div>

        {/* Hebrew Column */}
        <div className="space-y-4 p-4 bg-red-50/30 rounded-lg border border-red-100">
          <h3 className="font-bold text-red-800 flex items-center gap-2 justify-end">Hebrew Content 🇮🇱</h3>
          <input name="name_he" placeholder="שם המוצר" defaultValue={initialData?.name_he} className="w-full border border-red-200 rounded-lg p-2.5 text-right focus:border-red-500 outline-none" dir="rtl" />
          <textarea name="description_he" placeholder="תיאור המוצר..." defaultValue={initialData?.description_he} className="w-full border border-red-200 rounded-lg p-2.5 h-40 text-right focus:border-red-500 outline-none" dir="rtl" />
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
        <button 
          type="submit" 
          disabled={loading || uploading}
          className="bg-slate-900 text-white px-10 py-2.5 rounded-lg font-bold hover:bg-black disabled:opacity-50 shadow-lg shadow-gray-200 transition-all active:scale-95"
        >
          {loading ? 'Processing...' : (initialData?.id ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}