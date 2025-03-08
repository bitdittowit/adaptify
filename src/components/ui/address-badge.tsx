import { MapPin } from 'lucide-react';

import type { Address } from '@/types';

interface AddressBadgeProps {
    address: Address[];
}

export function AddressBadge({ address: addresses }: AddressBadgeProps) {
    return (
        <div className="border p-4 rounded-md grid gap-4">
            <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <h2 className="text-foreground font-semibold leading-none tracking-tight">Адреса</h2>
            </div>
            {addresses.map(address => (
                <div key={address.title}>
                    <div className="block text-muted-foreground text-sm mb-1">{address.title}</div>
                    <div className="bg-muted border border-border rounded-md p-2 text-sm text-foreground">
                        {address.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
