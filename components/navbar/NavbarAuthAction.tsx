import Link from 'next/link';
import { LogIn, User } from 'lucide-react';

type NavbarAuthActionProps = {
  localeHref: (path?: string) => string;
  isAuthenticated: boolean;
  profileLabel: string;
  loginLabel: string;
};

export default function NavbarAuthAction({
  localeHref,
  isAuthenticated,
  profileLabel,
  loginLabel,
}: NavbarAuthActionProps) {
  if (isAuthenticated) {
    return (
      <Link href={localeHref('/profile')} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
        <User size={22} />
        <span className="hidden sm:inline text-sm">{profileLabel}</span>
      </Link>
    );
  }

  return (
    <Link href={localeHref('/login')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
      <LogIn size={18} />
      <span>{loginLabel}</span>
    </Link>
  );
}