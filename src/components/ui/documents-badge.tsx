import { useTranslations } from 'next-intl';

import { FileText } from 'lucide-react';

import { LocalizedText } from '@/components/ui/localized-text';
import { cn } from '@/lib/utils';
import type { LocalizedText as LocalizedTextType } from '@/types';

interface DocumentsBadgeProps {
    documents: LocalizedTextType[];
    className?: string;
}

export function DocumentsBadge({ documents, className }: DocumentsBadgeProps) {
    const t = useTranslations();

    if (!documents || documents.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 shrink-0" />
                <span className="text-sm">{t('task.documents')}</span>
            </div>
            <div className="flex flex-col gap-1.5">
                {documents.map(document => (
                    <div
                        key={`${document.ru}-${document.en}`}
                        className="rounded-md bg-muted/50 border px-2 py-1.5 text-sm"
                    >
                        <LocalizedText text={document} />
                    </div>
                ))}
            </div>
        </div>
    );
}
