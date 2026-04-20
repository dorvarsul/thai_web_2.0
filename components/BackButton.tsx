'use client';

import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BackButton() {
  const t = useTranslations('Buttons');

  return (
    <Link
      href={`/`}
      className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors mb-4 group"
    >
      <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
      <span className="text-sm font-medium">{t('back')}</span>
    </Link>
  );
}