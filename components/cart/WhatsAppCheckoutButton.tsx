'use client';

import { useTranslations } from 'next-intl';
import type { CartItem } from '@/store/useCart';
import { buildWhatsAppOrderUrl } from '@/lib/whatsapp-order';

type WhatsAppCheckoutButtonProps = {
  items: CartItem[];
};

export default function WhatsAppCheckoutButton({ items }: WhatsAppCheckoutButtonProps) {
  const t = useTranslations('Cart');

  function handleCheckout() {
    const url = buildWhatsAppOrderUrl(items);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
    >
      {t('whatsappCheckout')}
    </button>
  );
}