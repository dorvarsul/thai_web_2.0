import Link from 'next/link';
import ContactScrollButton from '@/components/ContactScrollButton';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

type NavbarPrimaryLinksProps = {
  localeHref: (path?: string) => string;
  aboutLabel: string;
  contactLabel: string;
};

export default function NavbarPrimaryLinks({
  localeHref,
  aboutLabel,
  contactLabel,
}: NavbarPrimaryLinksProps) {
  return (
    <div className="hidden md:flex gap-6 text-gray-600 font-medium items-center">
      <Link href={localeHref('/about')} className="hover:text-red-600 transition">
        {aboutLabel}
      </Link>
      <ContactScrollButton label={contactLabel} />
      <a
        href="https://wa.me/972502322229"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-all hover:bg-[#128C7E] hover:scale-110 shadow-sm"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}