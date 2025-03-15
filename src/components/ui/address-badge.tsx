import { useTranslations } from 'next-intl';

import { MapPin } from 'lucide-react';

import { LocalizedText } from '@/components/ui/localized-text';
import { cn } from '@/lib/utils';
import type { Address } from '@/types';

interface AddressBadgeProps {
    addresses: Address[];
    className?: string;
}

export function AddressBadge({ addresses, className }: AddressBadgeProps) {
    const t = useTranslations();

    if (!addresses || addresses.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-sm">{t('task.addresses')}</span>
            </div>
            <div className="flex flex-col gap-1.5">
                {addresses.map(address => {
                    const key = `${address.title?.ru || ''}-${address.value.ru}`;
                    return (
                        <div key={key} className="flex flex-col gap-0.5">
                            <LocalizedText
                                text={address.title}
                                defaultValue={t('task.noAddressTitle')}
                                className="text-sm font-medium"
                            />
                            <LocalizedText
                                text={address.value}
                                defaultValue={t('task.noAddressValue')}
                                className="text-sm text-muted-foreground"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
