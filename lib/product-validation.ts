import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  price: z.coerce.number().positive(),
  stock_quantity: z.coerce.number().int().nonnegative(),
  category_id: z.string().uuid(),
  // Localized fields
  name_he: z.string().min(1, "Hebrew name required"),
  name_th: z.string().optional(),
  description_he: z.string().optional(),
  description_th: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.coerce.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;