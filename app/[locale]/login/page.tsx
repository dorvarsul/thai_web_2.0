'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase-client';
import { sanitizeInternalRedirectPath } from '@/lib/routing-helpers';
import AuthCard from '@/components/auth/AuthCard';
import AuthInputField from '@/components/auth/AuthInputField';
import { createLoginSchema } from '@/lib/auth-validation';

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Login');
  const formT = useTranslations('Auth');
  const schema = createLoginSchema(formT);
  const nextPath = sanitizeInternalRedirectPath(searchParams.get('next'), {
    locale,
    fallbackPath: `/${locale}/profile`,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setError('root', { message: t('errors.loginFailed') });
      return;
    }

    router.replace(nextPath);
    router.refresh();
  });

  return (
    <AuthCard
      title={t('title')}
      footer={
        <>
          {t('noAccount')}{' '}
          <Link href={`/${locale}/signup?next=${encodeURIComponent(nextPath)}`} className="text-blue-600 hover:underline">
            {t('signupLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthInputField
          type="email"
          placeholder={formT('email')}
          register={register('email')}
          error={errors.email?.message}
        />
        <AuthInputField
          type="password"
          placeholder={formT('password')}
          register={register('password')}
          error={errors.password?.message}
        />
        {errors.root?.message && <p className="text-sm text-red-600">{errors.root.message}</p>}
        <button disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {isSubmitting ? t('loading') : t('submit')}
        </button>
      </form>
    </AuthCard>
  );
}