'use client';

import { useCart } from '@/store/useCart';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import WhatsAppCheckoutButton from '@/components/cart/WhatsAppCheckoutButton';

export default function CartPage() {
  const { items, removeItem, addItem } = useCart();
  const locale = useLocale();
  const t = useTranslations('Cart');
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-medium mb-4">{t('emptyTitle')}</h2>
        <Link href={`/${locale}`} className="bg-blue-600 text-white px-6 py-2 rounded-lg">{t('continueShopping')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 font-heebo">{t('title')}</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-slate-500">{item.price} ₪</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => removeItem(item.id)} className="p-2 hover:bg-slate-50"><Minus size={16} /></button>
                <span className="px-4 font-medium">{item.quantity}</span>
                <button onClick={() => addItem(item)} className="p-2 hover:bg-slate-50"><Plus size={16} /></button>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-6 bg-slate-100 rounded-xl flex justify-between items-center">
        <span className="text-xl font-bold">{t('subtotal')}: {total} ₪</span>
        <WhatsAppCheckoutButton items={items} />
      </div>
    </div>
  );
}