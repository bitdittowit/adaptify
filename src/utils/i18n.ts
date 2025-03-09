import { useLocale } from 'next-intl';

import type { LocalizedText } from '@/types';

/**
 * React hook for getting localized text based on current locale
 * @param text LocalizedText object containing translations
 * @param defaultValue Optional default value to use if no translation is found
 */
export function useLocalizedText(text: LocalizedText | null | undefined, defaultValue = '') {
    const locale = useLocale();
    return getLocalizedTextWithLocale(text, locale, defaultValue);
}

/**
 * Utility function for getting localized text with explicit locale
 * @param text LocalizedText object containing translations
 * @param locale Locale to use for translation
 * @param defaultValue Optional default value to use if no translation is found
 */
export function getLocalizedTextWithLocale(text: LocalizedText | null | undefined, locale: string, defaultValue = '') {
    if (!text) {
        return defaultValue;
    }

    // Try current locale
    if (text[locale as keyof typeof text]) {
        return text[locale as keyof typeof text];
    }

    // Fallback to Russian
    if (text.ru) {
        return text.ru;
    }

    // Try English
    if (text.en) {
        return text.en;
    }

    // Last resort
    return defaultValue;
}
