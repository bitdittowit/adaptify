interface DocumentsBadgeProps {
    documents: string[];
}

export function DocumentsBadge({ documents }: DocumentsBadgeProps) {
    return (
        <div className="border p-4 rounded-md grid gap-4">
            <h2 className="text-gray-700 font-semibold leading-none tracking-tight">Необходимые документы</h2>
            {documents.map((document, index) => (
                <div key={`${document.length}-${index}`}>
                    <div className="bg-gray-100 border border-gray-300 rounded-md p-2 text-sm text-gray-900 font-semi-bold">
                        {document}
                    </div>
                </div>
            ))}
        </div>
    );
}
