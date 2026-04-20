import Link from 'next/link';
import { User, LogIn } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase-server';
import CartBadge from './CartBadge';
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image';
import ContactScrollButton from './ContactScrollButton';


type NavbarProps = {
  locale: string;
};

const WhatsAppIcon = () => (
  <svg 
    role="img" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 fill-current"
  >
    <title>WhatsApp</title>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.675 1.439 5.662 1.442h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);


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
            <div className="hidden md:flex gap-6 text-gray-600 font-medium items-center">
              <Link href={localeHref('/about')} className="hover:text-red-600 transition">{t('about')}</Link>
              <ContactScrollButton label={t('contact')} />
              <a 
                href="https://wa.me/972502322229" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-all hover:bg-[#128C7E] hover:scale-110 shadow-sm"
            >
              <WhatsAppIcon />
            </a>
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