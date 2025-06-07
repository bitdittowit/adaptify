'use client';

import { useState } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface QueryResult {
    rows: Record<string, unknown>[];
    columns: string[];
    rowCount: number;
}

export default function DbPlayground() {
    const [query, setQuery] = useState('SELECT * FROM users LIMIT 5');
    const [results, setResults] = useState<QueryResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const runQuery = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post<QueryResult>('/api/playground/query', { query });
            setResults(response.data);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'An error occurred');
            console.error('Error running query:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">Database Playground</h1>
            <p className="text-sm text-muted-foreground mb-4">
                This page is for testing database queries. Do not use in production.
            </p>
            
            <div className="mb-4">
                <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter SQL query..."
                    className="font-mono h-32"
                />
            </div>
            
            <Button onClick={runQuery} disabled={loading}>
                {loading ? 'Running...' : 'Run Query'}
            </Button>
            
            {error && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
                    <p className="font-semibold">Error:</p>
                    <pre className="text-sm whitespace-pre-wrap">{error}</pre>
                </div>
            )}
            
            {results && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Results:</h2>
                    <div className="overflow-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-muted">
                                    {results.columns && results.columns.map((col: string) => (
                                        <th key={col} className="border p-2 text-left">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.rows && results.rows.map((row, i) => (
                                    <tr key={i} className="border-b">
                                        {Object.values(row).map((val, j) => (
                                            <td key={j} className="border p-2">
                                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Total rows: {results.rowCount}
                    </p>
                </div>
            )}

            <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="text-lg font-semibold mb-2">Helpful Queries:</h3>
                <div className="space-y-2">
                    <div>
                        <h4 className="font-semibold">View Database Schema:</h4>
                        <pre className="text-xs bg-background p-2 rounded overflow-auto">
                            {`SELECT table_name, column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;`}
                        </pre>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-1" 
                            onClick={() => setQuery(`SELECT table_name, column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;`)}
                        >
                            Use This Query
                        </Button>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold">View Users (Safe):</h4>
                        <pre className="text-xs bg-background p-2 rounded overflow-auto">
                            {`SELECT id, name, email, country, study_group, experience, level 
FROM users 
LIMIT 10;`}
                        </pre>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-1" 
                            onClick={() => setQuery(`SELECT id, name, email, country, study_group, experience, level 
FROM users 
LIMIT 10;`)}
                        >
                            Use This Query
                        </Button>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold">Check For Admin Column:</h4>
                        <pre className="text-xs bg-background p-2 rounded overflow-auto">
                            {`SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'is_admin';`}
                        </pre>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-1" 
                            onClick={() => setQuery(`SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'is_admin';`)}
                        >
                            Use This Query
                        </Button>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold">View Table Relationships:</h4>
                        <pre className="text-xs bg-background p-2 rounded overflow-auto">
                            {`SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY';`}
                        </pre>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-1" 
                            onClick={() => setQuery(`SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY';`)}
                        >
                            Use This Query
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 