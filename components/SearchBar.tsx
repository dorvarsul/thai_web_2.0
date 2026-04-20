'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { Search } from 'lucide-react';
import { useState, useTransition } from 'react';

type SearchBarProps = {
  placeholder: string;
  targetPath?: string;
  initialQuery?: string;
};

export default function SearchBar({ placeholder, targetPath, initialQuery = '' }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(initialQuery);

  function handleSearch(term: string) {
    const params = new URLSearchParams();
    if (term.trim()) {
      params.set('q', term);
    }

    startTransition(() => {
      const basePath = targetPath ?? pathname;
      const queryString = params.toString();
      router.replace(queryString ? `${basePath}?${queryString}` : basePath);
    });
  }

  return (
    <div className="relative w-full max-w-md mb-8">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search size={18} className="text-slate-400" />
      </div>
      <input
        type="text"
        value={term}
        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
        placeholder={placeholder}
        onChange={(e) => {
          const value = e.target.value;
          setTerm(value);
          handleSearch(value);
        }}
      />
      {isPending && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}