import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'es', 'fr', 'zh-Hans', 'zh-Hant', 'ja', 'ko', 'hy', 'ru', 'fa', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(en|es|fr|zh-Hans|zh-Hant|ja|ko|hy|ru|fa|ar)/:path*'],
};