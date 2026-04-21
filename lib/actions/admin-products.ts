'use server'

import { createClient } from '@/lib/supabase-server';
import { productSchema } from '@/lib/product-validation';
import { translateText } from '@/lib/google-translate';
import { revalidatePath } from 'next/cache';

function optionalString(value: string | undefined | null) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function upsertProduct(data: unknown) {
  const supabase = await createClient();
  
  // 1. Authenticate & Role Check (Double-check even with RLS)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 2. Validate Input
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.format() };
  }

  const translatedNameTh =
    optionalString(result.data.name_th) ??
    (await translateText(result.data.name_he, 'th', 'he')) ??
    result.data.name_he;

  const translatedDescriptionTh =
    optionalString(result.data.description_th) ??
    (result.data.description_he
      ? (await translateText(result.data.description_he, 'th', 'he')) ?? result.data.description_he
      : undefined);

  const productData = {
    ...result.data,
    name: result.data.name_he.trim(),
    name_he: result.data.name_he.trim(),
    name_th: translatedNameTh,
    description_he: optionalString(result.data.description_he),
    description_th: translatedDescriptionTh,
    image_url: optionalString(result.data.image_url),
  };

  // 3. Database Operation
  const { error } = await supabase
    .from('products')
    .upsert(productData)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // 4. Cache Invalidation
  // This clears the cache for the storefront so the new product appears immediately
  revalidatePath('/[locale]/products', 'layout');
  revalidatePath('/[locale]/admin/products', 'page');

  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', id)
    .single();

    if (product?.image_url) {
      try {
        const path = product.image_url.split('product-images/')[1];

        if (path) {
          await supabase.storage
            .from('product-images')
            .remove([path]);
        }
      } catch (storageError) {
        console.error('Failed to delete image from storage:', storageError);
      }
    }
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/[locale]/products', 'layout');
  revalidatePath('/[locale]/admin/products', 'page');
  return { success: true };
}