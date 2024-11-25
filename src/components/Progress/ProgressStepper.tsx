"use client";

import { useState, useRef } from 'react';
import Level from './Level';
import { LEVELS } from '@/utils/constants';
import usePaths from '@/hooks/usePaths';
import styles from './ProgressStepper.module.css';


const ProgressStepper: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paths = usePaths(LEVELS, activeLevel, containerRef, styles.connector, styles.active);

  const handleLevelClick = (levelId: number) => {
    if (levelId <= activeLevel + 1) {
      setActiveLevel(levelId);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <svg className={styles.svg}>{paths}</svg>
      {LEVELS.map(({ id, position }) => (
        <Level
          key={id}
          id={id}
          position={position}
          isActive={id <= activeLevel}
          onClick={handleLevelClick}
        />
      ))}
    </div>
  );
};

export default ProgressStepper;
