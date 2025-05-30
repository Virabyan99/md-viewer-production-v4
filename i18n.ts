import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'es', 'fr'] as const;
export const localePrefix = 'always'; // Enforce locale prefixes in URLs (e.g., /en, /es)
export const defaultLocale = 'en'; // Set a default locale

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix,
  defaultLocale,
});