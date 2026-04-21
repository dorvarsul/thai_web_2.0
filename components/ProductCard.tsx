'use client';
import Image from 'next/image'; // 1. Add this import
import { useTranslations } from 'next-intl';
import { useCart } from '@/store/useCart';

type ProductCardProps = {
  locale: string;
  product: {
    id: string;
    name: string;
    price: number;
    categoryName: string | null;
    imageUrl: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const t = useTranslations('Buttons');
  const homeT = useTranslations('HomePage');

  return (
    <article className="cursor-pointer rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_35px_rgba(15,23,42,0.12)]">
      
      {/* 2. Updated Image Logic */}
      <div className="relative mb-4 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100/60 text-slate-400">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          homeT('imagePlaceholder')
        )}
      </div>

      <h3 className="text-lg font-extrabold text-slate-900">{product.name}</h3>
      <p className="mb-4 text-sm font-medium text-slate-500">{product.categoryName}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-xl font-black text-blue-700">₪{product.price}</span>
        <button
          type="button"
          onClick={() => addItem({ id: product.id, name: product.name, price: product.price })}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
        >
          {t('addToCart')}
        </button>
      </div>
    </article>
  );
}