import type { LocalizedText as LocalizedTextType } from '@/types';
import { useLocalizedText as useLocalized } from '@/utils/i18n';

interface LocalizedTextProps {
    text: LocalizedTextType | null | undefined;
    defaultValue?: string;
    className?: string;
}

export function LocalizedText({ text, defaultValue = '', className }: LocalizedTextProps) {
    const localizedText = useLocalized(text, defaultValue);
    return <span className={className}>{localizedText}</span>;
}
