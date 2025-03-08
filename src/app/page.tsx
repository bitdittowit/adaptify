'use client';

import dynamic from 'next/dynamic';

export default function Home() {
    const RoadMap = dynamic(() => import('@/components/road-map/road-map').then(mod => mod.default), { ssr: false });
    return (
        <main>
            <RoadMap />
        </main>
    );
}
