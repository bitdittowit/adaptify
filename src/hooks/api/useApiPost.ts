import { useState } from 'react';

interface UsePostRequestResponse<TResponse> {
    postData: <TRequest>(url: string, data: TRequest) => Promise<TResponse | null>;
    loading: boolean;
    error: string | null;
}

export function useApiPost<TResponse>(): UsePostRequestResponse<TResponse> {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const postData = async <TRequest>(url: string, data: TRequest): Promise<TResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to make POST request');
            }

            const result: TResponse = await response.json();
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unexpected error');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { postData, loading, error };
}
