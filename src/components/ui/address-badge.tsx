import { useTranslations } from 'next-intl';

import { MapPin } from 'lucide-react';

import { LocalizedText } from '@/components/ui/localized-text';
import type { Address } from '@/types';

interface AddressBadgeProps {
    addresses: Address[];
}

export function AddressBadge({ addresses }: AddressBadgeProps) {
    const t = useTranslations();

    if (!addresses || addresses.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{t('task.addresses')}</h2>
            <div className="flex flex-col gap-2">
                {addresses.map(address => {
                    const key = `${address.title?.ru || ''}-${address.value.ru}`;
                    return (
                        <div key={key} className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 mt-0.5" />
                            <div className="flex flex-col">
                                <LocalizedText
                                    text={address.title}
                                    defaultValue={t('task.noAddressTitle')}
                                    className="font-medium"
                                />
                                <LocalizedText
                                    text={address.value}
                                    defaultValue={t('task.noAddressValue')}
                                    className="text-muted-foreground"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
