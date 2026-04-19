import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { sanitizeInternalRedirectPath } from '@/lib/routing-helpers';

const FALLBACK_PATH = `/${routing.defaultLocale}`;

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextPath = sanitizeInternalRedirectPath(requestUrl.searchParams.get('next'), {
    locale: routing.defaultLocale,
    fallbackPath: FALLBACK_PATH,
  });
  const response = NextResponse.redirect(new URL(nextPath, requestUrl.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}