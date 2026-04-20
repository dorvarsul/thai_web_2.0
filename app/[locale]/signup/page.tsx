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
import { createSignupSchema } from '@/lib/auth-validation';

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
  const schema = createSignupSchema(formT);
  const nextPath = sanitizeInternalRedirectPath(searchParams.get('next'), {
    locale,
    fallbackPath: `/${locale}/profile`,
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
    <AuthCard
      title={t('title')}
      footer={
        <>
          {t('haveAccount')}{' '}
          <Link href={`/${locale}/login?next=${encodeURIComponent(nextPath)}`} className="text-blue-600 hover:underline">
            {t('loginLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <AuthInputField
          type="text"
          placeholder={formT('fullName')}
          register={register('fullName')}
          error={errors.fullName?.message}
        />
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
        <AuthInputField
          type="password"
          placeholder={formT('confirmPassword')}
          register={register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        {errors.root?.message && <p className="text-sm text-red-600">{errors.root.message}</p>}
        <button disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {isSubmitting ? t('loading') : t('submit')}
        </button>
      </form>
    </AuthCard>
  );
}