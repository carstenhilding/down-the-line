import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

let locales = ['da', 'en'];
let defaultLocale = 'da';

function getLocale(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
    console.log(`Middleware: Locale already in path: ${pathSegments[0]}`);
    return pathSegments[0];
  }

  const acceptLanguageHeader = request.headers.get('accept-language');
  if (acceptLanguageHeader) {
    const preferredLocale = acceptLanguageHeader.split(',')[0].split('-')[0].toLowerCase();
    if (locales.includes(preferredLocale)) {
        console.log(`Middleware: Browser preferred locale: ${preferredLocale}`);
        return preferredLocale;
    }
  }

  console.log(`Middleware: Using default locale: ${defaultLocale}`);
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware: Incoming pathname: ${pathname}`);

  // Vi skal IKKE have en tidlig return her, da config.matcher nu håndterer ekskluderingen
  // Den tidligere if-blok er FJERNET

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  console.log(`Middleware: Pathname has locale? ${pathnameHasLocale}`);

  if (pathnameHasLocale) {
    console.log(`Middleware: Pathname already has locale, continuing.`);
    return;
  }

  const locale = getLocale(request);
  const newPathname = `/${locale}${pathname}`;

  console.log(`Middleware: No locale in pathname. Redirecting to: ${newPathname}`);
  request.nextUrl.pathname = newPathname;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Match alle stier undtagen:
    // 1. _next/ (Next.js internals)
    // 2. /api/ (Your API routes)
    // 3. /images/ (Dine billeder)
    // 4. statiske filer med filendelser (f.eks. .ico, .png, .jpg, .jpeg, .gif, .svg, .webp, .css, .js)
    // 5. _next/static/ (Next.js statiske aktiver)
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|api|images|.+\\.(?:png|jpg|jpeg|gif|svg|webp|css|js)$).*)',
  ],
};