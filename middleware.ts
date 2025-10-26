import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

let locales = ['da', 'en'];
let defaultLocale = 'da';

function getLocale(request: NextRequest) {
  // ... (original getLocale kode) ...
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

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  console.log(`Middleware: Pathname has locale? ${pathnameHasLocale}`);

  if (pathnameHasLocale) {
    console.log(`Middleware: Pathname already has locale, continuing.`);
    // KORREKTION: Brug NextResponse.next() her ifølge Next.js docs
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const newPathname = `/${locale}${pathname}`;

  console.log(`Middleware: No locale in pathname. Redirecting to: ${newPathname}`);
  request.nextUrl.pathname = newPathname;
  // Brug redirect for at ændre URL'en i browseren
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
   '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|api|images|.+\\.(?:png|jpg|jpeg|gif|svg|webp|css|js)$).*)',
  ],
};