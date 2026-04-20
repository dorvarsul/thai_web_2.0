'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase-client';
import { sanitizeInternalRedirectPath } from '@/lib/routing-helpers';

type SignupFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Signup');
  const formT = useTranslations('Auth');
  const nextPath = sanitizeInternalRedirectPath(searchParams.get('next'), {
    locale,
    fallbackPath: `/${locale}/profile`,
  });

  const schema = z.object({
    fullName: z.string().min(1, formT('validation.required')),
    email: z.string().min(1, formT('validation.required')).email(formT('validation.email')),
    password: z.string().min(1, formT('validation.required')).min(6, formT('validation.passwordMin')),
    confirmPassword: z.string().min(1, formT('validation.required')),
  }).refine((values) => values.password === values.confirmPassword, {
    message: formT('validation.passwordMismatch'),
    path: ['confirmPassword'],
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    const supabase = createClient();
    const callbackUrl = new URL(`/auth/callback`, window.location.origin);
    callbackUrl.searchParams.set('next', nextPath);

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: callbackUrl.toString(),
        data: { full_name: values.fullName },
      },
    });

    if (error) {
      setError('root', { message: t('errors.signupFailed') });
      return;
    }

    router.replace(nextPath);
  });

  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-center text-3xl font-bold font-heebo">{t('title')}</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder={formT('fullName')}
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            {...register('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder={formT('email')}
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder={formT('password')}
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            {...register('password')}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder={formT('confirmPassword')}
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>
        {errors.root?.message && <p className="text-sm text-red-600">{errors.root.message}</p>}
        <button disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {isSubmitting ? t('loading') : t('submit')}
        </button>
      </form>
      <p className="mt-4 text-center text-slate-600">
        {t('haveAccount')}{' '}
        <Link href={`/${locale}/login?next=${encodeURIComponent(nextPath)}`} className="text-blue-600 hover:underline">
          {t('loginLink')}
        </Link>
      </p>
    </div>
  );
}