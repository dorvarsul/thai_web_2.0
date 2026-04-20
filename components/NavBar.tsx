import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase-server';
import CartBadge from './CartBadge';
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image';
import NavbarPrimaryLinks from '@/components/navbar/NavbarPrimaryLinks';
import NavbarAuthAction from '@/components/navbar/NavbarAuthAction';

type NavbarProps = {
  locale: string;
};

export default async function Navbar({ locale }: NavbarProps) {
  const t = await getTranslations('Navbar');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // --- Start Admin Check ---
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    isAdmin = profile?.role === 'admin';
  }
  // --- End Admin Check ---

  const localeHref = (path = '') => `/${locale}${path}`;

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Right Side (RTL context) */}
          <div className="flex items-center gap-8">
            <Link href={localeHref()} className="flex items-center">
              <Image 
                src="/logo.png"
                alt="Thai Shop Logo"
                width={120}
                height={40}
                priority
                className="h-10 w-auto"
              />
            </Link>
            <NavbarPrimaryLinks localeHref={localeHref} aboutLabel={t('about')} contactLabel={t('contact')} />
            
            {/* Admin Link: Placed inside the Primary Links area */}
            {isAdmin && (
              <Link 
                href={localeHref('/admin')}
                className="text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Left Side */}
          <div className="flex items-center gap-4">
            
            <LanguageSwitcher />

            <CartBadge />

            <div className="h-6 w-[1px] bg-gray-200 mx-2" />
            <NavbarAuthAction
              localeHref={localeHref}
              isAuthenticated={Boolean(user)}
              profileLabel={t('profile')}
              loginLabel={t('login')}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}