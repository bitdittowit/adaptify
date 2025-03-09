import { useTranslations } from 'next-intl';

import { Mail, Phone } from 'lucide-react';

import { LocalizedText } from '@/components/ui/localized-text';
import type { Contacts } from '@/types';

interface ContactsBadgeProps {
    contacts: Contacts;
}

export function ContactsBadge({ contacts }: ContactsBadgeProps) {
    const t = useTranslations();

    const phones = contacts?.phones || [];
    const emails = contacts?.emails || [];

    if (phones.length === 0 && emails.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{t('task.contacts')}</h2>
            <div className="flex flex-col gap-2">
                {phones.map(phone => {
                    const key = `${phone.title?.ru || ''}-${phone.value}`;
                    return (
                        <div key={key} className="flex items-start gap-2">
                            <Phone className="h-5 w-5 mt-0.5" />
                            <div className="flex flex-col">
                                <LocalizedText
                                    text={phone.title}
                                    defaultValue={t('task.noPhoneTitle')}
                                    className="font-medium"
                                />
                                <span className="text-muted-foreground">{phone.value}</span>
                            </div>
                        </div>
                    );
                })}
                {emails.map(email => {
                    const key = `${email.title?.ru || ''}-${email.value}`;
                    return (
                        <div key={key} className="flex items-start gap-2">
                            <Mail className="h-5 w-5 mt-0.5" />
                            <div className="flex flex-col">
                                <LocalizedText
                                    text={email.title}
                                    defaultValue={t('task.noEmailTitle')}
                                    className="font-medium"
                                />
                                <span className="text-muted-foreground">{email.value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
