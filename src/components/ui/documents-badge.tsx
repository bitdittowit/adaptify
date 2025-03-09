import { useTranslations } from 'next-intl';

import { FileText } from 'lucide-react';

import { LocalizedText } from '@/components/ui/localized-text';
import type { LocalizedText as LocalizedTextType } from '@/types';

interface DocumentsBadgeProps {
    documents: LocalizedTextType[];
}

export function DocumentsBadge({ documents }: DocumentsBadgeProps) {
    const t = useTranslations();

    return (
        <div className="border p-4 rounded-md grid gap-4">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <h2 className="text-foreground font-semibold leading-none tracking-tight">{t('task.documents')}</h2>
                </div>
                <div className="space-y-2">
                    {documents.map(document => (
                        <div key={`${document.ru}-${document.en}`}>
                            <div className="bg-muted border border-border rounded-md p-2 text-sm text-foreground font-semi-bold">
                                <LocalizedText text={document} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
