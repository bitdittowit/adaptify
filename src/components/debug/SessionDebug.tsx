'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';

/**
 * Debug component for inspecting session data
 * 
 * This component is for development use only.
 * Import and add it to your layout when debugging session issues:
 * 
 * ```tsx
 * // In a layout or page component:
 * import { SessionDebug } from '@/components/debug/SessionDebug';
 * 
 * // Then add it to your JSX:
 * <SessionDebug />
 * ```
 */
export function SessionDebug() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  
  // Only show in development environment
  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md p-4 bg-black/80 text-white text-xs rounded shadow-lg overflow-auto max-h-96">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Session Debug ({status})</h3>
        <button 
          onClick={() => setIsVisible(false)} 
          className="p-1 hover:bg-gray-700 rounded"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
      <pre className="text-xs">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
} 