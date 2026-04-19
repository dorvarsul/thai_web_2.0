import Link from 'next/link';
import { User, LogIn } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase-server';
import CartBadge from './CartBadge';
import LanguageSwitcher from './LanguageSwitcher';

type NavbarProps = {
  locale: string;
};

export default async function Navbar({ locale }: NavbarProps) {
  const t = await getTranslations('Navbar');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const localeHref = (path = '') => `/${locale}${path}`;

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Right Side (RTL context) */}
          <div className="flex items-center gap-8">
            <Link href={localeHref()} className="text-2xl font-bold text-blue-600 font-heebo">
              תאי ווב
            </Link>
            <div className="hidden md:flex gap-6 text-gray-600 font-medium">
              <Link href={localeHref('/about')} className="hover:text-blue-500 transition">{t('about')}</Link>
            </div>
          </div>

          {/* Left Side */}
          <div className="flex items-center gap-4">
            
            <LanguageSwitcher />

            <CartBadge />

            <div className="h-6 w-[1px] bg-gray-200 mx-2" />

            {user ? (
              <Link href={localeHref('/profile')} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                <User size={22} />
                <span className="hidden sm:inline text-sm">{t('profile')}</span>
              </Link>
            ) : (
              <Link href={localeHref('/login')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <LogIn size={18} />
                <span>{t('login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}