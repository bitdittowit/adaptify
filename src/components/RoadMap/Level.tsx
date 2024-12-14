import type { FC } from 'react';
import type { Position } from '@/types';
import styles from './RoadMap.module.css';

interface LevelProps {
    id: number;
    position: Position;
    isActive: boolean;
    onClick?: (id: number) => void;
}

const Level: FC<LevelProps> = ({ id, position, isActive, onClick }) => (
    <div
        className={`${styles.level} ${isActive ? styles.active : ''}`}
        style={{ ...position, transform: 'translateX(-50%)' }}
        onClick={() => onClick?.(id)}
    >
        {id}
    </div>
);

export default Level;
