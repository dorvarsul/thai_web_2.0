'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProduct, upsertProductsBulk } from '@/lib/actions/admin-products';
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
  const [batch, setBatch] = useState<Partial<ProductInput>[]>([]);
  const formRef = useRef<HTMLFormElement | null>(null);
  
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

  function collectRawDataFromForm(): Record<string, string> {
    if (!formRef.current) return {};
    const fd = new FormData(formRef.current);
    const raw = Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, typeof v === 'string' ? v : '']));
    raw.image_url = imageUrl;
    return raw as Record<string, string>;
  }

  function handleAddToBatch() {
    setError(null);
    try {
      const raw = collectRawDataFromForm();
      // push minimal typed data
      setBatch(prev => [...prev, raw as Partial<ProductInput>]);
      // reset form for next product
      formRef.current?.reset();
      setImageUrl('');
    } catch (err: any) {
      setError(err?.message || 'Failed to add product to batch');
    }
  }

  async function handleUploadBatch() {
    if (batch.length === 0) return;
    setLoading(true);
    setError(null);

    const result = await upsertProductsBulk(batch as unknown[]);

    if (result?.error) {
      setError(typeof result.error === 'string' ? result.error : 'Bulk upload failed');
      setLoading(false);
    } else {
      router.push(`/${safeLocale}/admin/products`);
      router.refresh();
    }
  }

  function removeFromBatch(index: number) {
    setBatch(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-5xl">
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

      {/* Batch Queue Panel */}
      <div className="mt-4">
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            name="is_featured"
            value="true"
            defaultChecked={!!initialData?.is_featured}
            className="w-4 h-4 rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm text-gray-700">Show on main page</span>
        </label>
      </div>

      {batch.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold mb-2">Queued Products ({batch.length})</h4>
          <ul className="space-y-2">
            {batch.map((b, i) => (
              <li key={i} className="flex justify-between items-center bg-white p-3 rounded border">
                <div>
                  <div className="font-medium text-sm">{b.name_he || b.name_th || 'Untitled'}</div>
                  <div className="text-xs text-gray-500">₪{b.price || '—'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => removeFromBatch(i)} className="text-red-600 hover:underline text-sm">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between gap-4 border-t pt-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleAddToBatch} disabled={uploading} className="px-4 py-2 text-sm bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100">Add to Batch</button>
          <button type="button" onClick={handleUploadBatch} disabled={batch.length === 0 || loading} className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">Upload Batch ({batch.length})</button>
        </div>

        <div>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
          <button 
            type="submit" 
            disabled={loading || uploading}
            className="bg-slate-900 text-white px-10 py-2.5 rounded-lg font-bold hover:bg-black disabled:opacity-50 shadow-lg shadow-gray-200 transition-all active:scale-95"
          >
            {loading ? 'Processing...' : (initialData?.id ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </div>
    </form>
  );
}