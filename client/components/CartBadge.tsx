'use client'; // This is required for Zustand and Hooks

import { useSyncExternalStore } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/store/useCart';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function CartBadge() {
  const locale = useLocale();
  const t = useTranslations('Navbar');
  const totalItems = useCart((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <Link href={`/${locale}/cart`} aria-label={t('cart')} className="relative p-2 hover:bg-gray-100 rounded-full transition">
      <ShoppingCart size={22} />
      {mounted && totalItems > 0 && (
        <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {totalItems}
        </span>
      )}
    </Link>
  );
}