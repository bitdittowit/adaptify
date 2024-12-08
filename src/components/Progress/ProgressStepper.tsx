"use client";

import { useState, useRef, useEffect } from 'react';
import { LEVELS } from '@/utils/constants';
import usePaths from '@/hooks/usePaths';
import Level from './Level';
import styles from './ProgressStepper.module.css';

const ProgressStepper: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paths = usePaths(LEVELS, activeLevel, containerRef, styles.connector, styles.active, styles.back);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  const handleLevelClick = (levelId: number) => {
    if (levelId <= activeLevel + 1) {
      setActiveLevel(levelId);
    }
  };

  return (
    <div
    className={styles.container}
    ref={containerRef}
    style={{minHeight: LEVELS[LEVELS.length - 1].position.bottom + 120}}>
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
