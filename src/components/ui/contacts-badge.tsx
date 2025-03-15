import { useTranslations } from 'next-intl';

import { Phone } from 'lucide-react';

import { LocalizedText } from '@/components/ui/localized-text';
import { cn } from '@/lib/utils';
import type { Contacts } from '@/types';

interface ContactsBadgeProps {
    contacts: Contacts;
    className?: string;
}

export function ContactsBadge({ contacts, className }: ContactsBadgeProps) {
    const t = useTranslations();

    const phones = contacts?.phones || [];
    const emails = contacts?.emails || [];

    if (phones.length === 0 && emails.length === 0) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span className="text-sm">{t('task.contacts')}</span>
            </div>
            <div className="flex flex-col gap-1.5">
                {phones.map(phone => {
                    const key = `${phone.title?.ru || ''}-${phone.value}`;
                    return (
                        <div key={key} className="flex flex-col gap-0.5">
                            <LocalizedText
                                text={phone.title}
                                defaultValue={t('task.noPhoneTitle')}
                                className="text-sm font-medium"
                            />
                            {typeof phone.value === 'string' ? (
                                <span className="text-sm text-muted-foreground">{phone.value}</span>
                            ) : (
                                <LocalizedText
                                    text={phone.value}
                                    defaultValue={t('task.noPhoneTitle')}
                                    className="text-sm text-muted-foreground"
                                />
                            )}
                        </div>
                    );
                })}
                {emails.map(email => {
                    const key = `${email.title?.ru || ''}-${email.value}`;
                    return (
                        <div key={key} className="flex flex-col gap-0.5">
                            <LocalizedText
                                text={email.title}
                                defaultValue={t('task.noEmailTitle')}
                                className="text-sm font-medium"
                            />
                            <span className="text-sm text-muted-foreground">{email.value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
