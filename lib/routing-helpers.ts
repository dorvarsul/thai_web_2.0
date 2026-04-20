import { routing } from '@/i18n/routing';

const MAX_REDIRECT_LENGTH = 2048;

export function isSupportedLocale(locale: string): locale is (typeof routing.locales)[number] {
  return routing.locales.includes(locale as (typeof routing.locales)[number]);
}

export function getLocaleFromPathname(pathname: string): (typeof routing.locales)[number] {
  const locale = pathname.split('/')[1] ?? '';
  return isSupportedLocale(locale) ? locale : routing.defaultLocale;
}

type SanitizeRedirectOptions = {
  locale: string;
  fallbackPath: string;
};

export function sanitizeInternalRedirectPath(
  rawPath: string | null | undefined,
  { locale, fallbackPath }: SanitizeRedirectOptions
): string {
  if (!rawPath) {
    return fallbackPath;
  }

  const candidate = rawPath.trim();

  if (
    candidate.length === 0 ||
    candidate.length > MAX_REDIRECT_LENGTH ||
    !candidate.startsWith('/') ||
    candidate.startsWith('//')
  ) {
    return fallbackPath;
  }

  const safeLocale = isSupportedLocale(locale) ? locale : routing.defaultLocale;

  try {
    const parsed = new URL(candidate, 'https://local.invalid');

    if (parsed.origin !== 'https://local.invalid') {
      return fallbackPath;
    }

    const internalPath = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    const redirectLocale = parsed.pathname.split('/')[1] ?? '';

    if (isSupportedLocale(redirectLocale)) {
      return internalPath;
    }

    if (internalPath.startsWith('/')) {
      return `/${safeLocale}${internalPath}`;
    }

    return fallbackPath;
  } catch {
    return fallbackPath;
  }
}

export function getLocalizedField<T extends object>(
  item: T | null | undefined,
  field: string,
  locale: string
) {
  if (!item) return '';

  const source = item as Record<string, unknown>;
  
  const localizedKey = `${field}_${locale}`;     // e.g., 'name_th' or 'name_he'
  const fallbackKey = `${field}_he`;             // e.g., 'name_he' (your new standard)

  // 1. Try the current locale (e.g., name_th)
  // 2. If missing, try the standard fallback (name_he)
  // 3. Last resort, empty string
  const localizedValue = source[localizedKey];
  if (typeof localizedValue === 'string' && localizedValue.length > 0) {
    return localizedValue;
  }

  const fallbackValue = source[fallbackKey];
  if (typeof fallbackValue === 'string' && fallbackValue.length > 0) {
    return fallbackValue;
  }

  return '';
}