import type { FC } from 'react';

import type { Position } from '@/types';

import styles from './road-map.module.css';

interface LevelProps {
    id: number;
    position: Position;
    isActive: boolean;
    onClick?: (id: number) => void;
}

const Level: FC<LevelProps> = ({ id, position, isActive, onClick }) => (
    // <div
    //     className={`${styles.level} ${isActive ? styles.active : ''}`}
    //     style={{ ...position }}
    //     onClick={() => onClick?.(id)}
    // >
    //     <div className={styles.levelNumber}>{id}</div>
    // </div>
    <div
        className={`${styles.level} ${isActive ? styles.active : ''}`}
        style={{ ...position, zIndex: -id }}
        onClick={() => onClick?.(id)}
    >
        <div className={`${styles.cubeFace} ${styles.cubeFaceFront}`} />
        <div className={`${styles.cubeFace} ${styles.cubeFaceBack}`} />
        <div className={`${styles.cubeFace} ${styles.cubeFaceRight}`} />
        <div className={`${styles.cubeFace} ${styles.cubeFaceLeft}`} />
        <div className={`${styles.cubeFace} ${styles.cubeFaceTop}`}>
            <div className={styles.levelNumber}>{id}</div>
        </div>
        <div className={`${styles.cubeFace} ${styles.cubeFaceBottom}`} />
    </div>
);

export default Level;
