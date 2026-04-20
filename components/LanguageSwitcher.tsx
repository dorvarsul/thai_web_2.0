'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Languages } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleLanguage = () => {
    const nextLocale = locale === 'he' ? 'th' : 'he';
    const suffix = pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) : pathname;
    const query = searchParams.toString();
    router.push(`/${nextLocale}${suffix}${query ? `?${query}` : ''}`);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center border rounded-md px-2 py-1 gap-2 hover:bg-gray-50 cursor-pointer transition"
    >
      <Languages size={18} />
      <span className="text-sm font-medium uppercase">
        {locale === 'he' ? 'TH' : 'HE'}
      </span>
    </button>
  );
}