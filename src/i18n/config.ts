export type Locale = (typeof locales)[number];

// A list of all locales that are supported
export const locales = ['ru', 'en'] as const;

// Used when no locale matches
export const defaultLocale: Locale = 'ru';
