'use client';

import { useEffect, useRef } from 'react';
import type { FC } from 'react';

import { useGetUserLevelSummary } from '@/hooks/api/entities/users/use-get-user-level-summary';
import { LEVELS } from '@/utils/constants';

import Level from './level';
import styles from './road-map.module.css';

const LAYOUT_OFFSET_PX = 120;

const RoadMap: FC = () => {
    const { data: userLevelSummary } = useGetUserLevelSummary();
    const containerRef = useRef<HTMLDivElement | null>(null);

    const currentLevel = userLevelSummary?.level ?? 0;

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, []);

    return (
        <div
            className={styles.container}
            ref={containerRef}
            style={{
                minHeight: LEVELS[LEVELS.length - 1].position.bottom + LAYOUT_OFFSET_PX,
            }}
        >
            {LEVELS.map(({ id, position }) => (
                <Level key={id} id={id} position={position} isActive={id <= currentLevel} />
            ))}
        </div>
    );
};

export default RoadMap;
