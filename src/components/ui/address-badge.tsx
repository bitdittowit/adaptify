import type { Address } from '@/types';

interface AddressBadgeProps {
    address: Address[];
}

export function AddressBadge({ address: addresses }: AddressBadgeProps) {
    return (
        <div className="border p-4 rounded-md grid gap-4">
            <h2 className="text-gray-700 font-semibold leading-none tracking-tight">Адреса</h2>
            {addresses.map((address, index) => (
                <div key={`${address.value}-${index}`}>
                    <div className="block text-gray-500 text-sm mb-1">{address.title}</div>
                    <div className="bg-gray-100 border border-gray-300 rounded-md p-2 text-sm text-gray-900">
                        {address.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
