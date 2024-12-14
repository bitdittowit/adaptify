'use client';
import dynamic from 'next/dynamic';

export default function Home() {
    const RoadMap = dynamic(() => import('@/components/RoadMap/RoadMap').then(mod => mod.default), { ssr: false });
    return (
        <main>
            <RoadMap />
        </main>
    );
}
