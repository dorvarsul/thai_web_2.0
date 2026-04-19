import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

function copyCookies(source: NextResponse, destination: NextResponse) {
  source.cookies.getAll().forEach(({ name, value }) => {
    destination.cookies.set(name, value);
  });
}

function getLocaleFromPathname(pathname: string) {
  const locale = pathname.split('/')[1];
  return routing.locales.includes(locale as (typeof routing.locales)[number]) ? locale : routing.defaultLocale;
}

export default async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  const location = response.headers.get('location');

  if (location) {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPathname(pathname);
  const isProfileRoute = pathname.startsWith(`/${locale}/profile`);
  const isAdminRoute = pathname.startsWith(`/${locale}/admin`);

  if (!isProfileRoute && !isAdminRoute) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value);
          });
        },
      },
    }
  );

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/login`;
    loginUrl.searchParams.set('next', pathname + request.nextUrl.search);

    const redirectResponse = NextResponse.redirect(loginUrl);
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  if (isAdminRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profile?.role !== 'admin') {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = `/${locale}`;
      homeUrl.search = '';

      const redirectResponse = NextResponse.redirect(homeUrl);
      copyCookies(response, redirectResponse);
      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};