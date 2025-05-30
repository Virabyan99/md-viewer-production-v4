// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always', // Enforces /en, /es, /fr in URLs
});

export const config = {
  matcher: ['/', '/(en|es|fr)/:path*'], // Match root and locale-prefixed paths
};