import { FileText } from 'lucide-react';

interface DocumentsBadgeProps {
    documents: string[];
}

export function DocumentsBadge({ documents }: DocumentsBadgeProps) {
    return (
        <div className="border p-4 rounded-md grid gap-4">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <h2 className="text-foreground font-semibold leading-none tracking-tight">Необходимые документы</h2>
                </div>
                <div className="space-y-2">
                    {documents.map((document, index) => (
                        <div key={`${document.length}-${index}`}>
                            <div className="bg-muted border border-border rounded-md p-2 text-sm text-foreground font-semi-bold">
                                {document}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
