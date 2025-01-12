import type { Contacts } from '@/types';

interface ContactsBadgeProps {
    contacts: Contacts;
}

export function ContactsBadge({ contacts }: ContactsBadgeProps) {
    return (
        <div className="border p-4 rounded-md grid gap-4">
            <h2 className="text-gray-700 font-semibold leading-none tracking-tight">Контакты для связи</h2>
            {contacts.phones?.map((phone, index) => (
                <div key={`${phone.value}-${index}`}>
                    <div className="block text-gray-500 text-sm mb-1">{phone.title}</div>
                    <div className="bg-gray-100 border border-gray-300 rounded-md p-2 text-sm text-gray-900 font-semi-bold">
                        {phone.value}
                    </div>
                </div>
            ))}
            {contacts.emails?.map((email, index) => (
                <div key={`${email.value}-${index}`}>
                    <div className="block text-gray-500 text-sm mb-1">{email.title}</div>
                    <div className="bg-gray-100 border border-gray-300 rounded-md p-2 text-sm text-gray-900 font-semi-bold">
                        {email.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
