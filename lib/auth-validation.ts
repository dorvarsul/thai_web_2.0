import { z } from 'zod';

type Translation = (key: string) => string;

export function createLoginSchema(t: Translation) {
  return z.object({
    email: z.string().min(1, t('validation.required')).email(t('validation.email')),
    password: z.string().min(1, t('validation.required')).min(6, t('validation.passwordMin')),
  });
}

export function createSignupSchema(t: Translation) {
  return z
    .object({
      fullName: z.string().min(1, t('validation.required')),
      email: z.string().min(1, t('validation.required')).email(t('validation.email')),
      password: z.string().min(1, t('validation.required')).min(6, t('validation.passwordMin')),
      confirmPassword: z.string().min(1, t('validation.required')),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    });
}