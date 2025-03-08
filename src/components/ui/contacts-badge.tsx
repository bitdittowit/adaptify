import { Phone } from 'lucide-react';

import type { Contacts } from '@/types';

interface ContactsBadgeProps {
    contacts: Contacts;
}

export function ContactsBadge({ contacts }: ContactsBadgeProps) {
    return (
        <div className="border p-4 rounded-md grid gap-4">
            <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <h2 className="text-foreground font-semibold leading-none tracking-tight">Контакты для связи</h2>
            </div>
            {contacts.phones?.map((phone, index) => (
                <div key={`${phone.value}-${index}`}>
                    <div className="block text-muted-foreground text-sm mb-1">{phone.title}</div>
                    <div className="bg-muted border border-border rounded-md p-2 text-sm text-foreground font-semi-bold">
                        {phone.value}
                    </div>
                </div>
            ))}
            {contacts.emails?.map((email, index) => (
                <div key={`${email.value}-${index}`}>
                    <div className="block text-muted-foreground text-sm mb-1">{email.title}</div>
                    <div className="bg-muted border border-border rounded-md p-2 text-sm text-foreground font-semi-bold">
                        {email.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
