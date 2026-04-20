import type { CartItem } from '@/store/useCart';

const WHATSAPP_PHONE_NUMBER = '972502322229';

function formatMoney(amount: number) {
  return `₪${amount.toFixed(2)}`;
}

export function buildWhatsAppOrderMessage(items: CartItem[]) {
  const lines = items.map((item) => {
    const lineTotal = item.price * item.quantity;
    return `${item.quantity} x ${item.name} - ${formatMoney(item.price)} = ${formatMoney(lineTotal)}`;
  });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return [
    'שלום, ברצוני לבצע הזמנה:',
    '',
    ...lines,
    '',
    `סה"כ: ${formatMoney(total)}`,
  ].join('\n');
}

export function buildWhatsAppOrderUrl(items: CartItem[]) {
  const message = buildWhatsAppOrderMessage(items);
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}