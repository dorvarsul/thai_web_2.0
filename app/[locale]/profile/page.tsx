'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Profile');

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace(`/${locale}/login?next=/${locale}/profile`);
      } else {
        setUser(data.user);
      }

      setLoading(false);
    };
    getUser();
  }, [locale, router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh(); // Refresh to update Navbar state
    router.replace(`/${locale}`);
  };

  if (loading) return <div className="p-20 text-center">{t('loading')}</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold mb-4 font-heebo">{t('title')}</h1>
      <div className="space-y-2 text-slate-700">
        <p><strong>{t('email')}:</strong> {user.email}</p>
        <p><strong>{t('id')}:</strong> {user.id}</p>
      </div>
      <button 
        onClick={handleLogout}
        className="mt-8 bg-red-50 text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-100 transition"
      >
        {t('logout')}
      </button>
    </div>
  );
}