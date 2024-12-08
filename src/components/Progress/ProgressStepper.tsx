"use client";

import { useRef, useEffect } from 'react';
import { LEVELS } from '@/utils/constants';
import usePaths from '@/hooks/usePaths';
import { useGetUserLevelSummary } from '@/hooks/api/entities/users/useGetUserLevel';
import Level from './Level';
import styles from './ProgressStepper.module.css';

const LAYOUT_OFFSET_PX = 120;

const ProgressStepper: React.FC = () => {
  const { data: userLevelSummary } = useGetUserLevelSummary();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentLevel = userLevelSummary?.level ?? 0;
  const paths = usePaths(
    LEVELS,
    currentLevel,
    containerRef,
    styles.connector,
    styles.active,
    styles.back,
  );

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  return (
    <div
    className={styles.container}
    ref={containerRef}
    style={{
      minHeight: LEVELS[LEVELS.length - 1].position.bottom + LAYOUT_OFFSET_PX,
    }}>
      <svg className={styles.svg}>{paths}</svg>
      {LEVELS.map(({ id, position }) => (
        <Level
          key={id}
          id={id}
          position={position}
          isActive={id <= currentLevel}
        />
      ))}
    </div>
  );
};

export default ProgressStepper;
