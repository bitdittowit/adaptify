"use client";

import { useState, useRef, useEffect } from 'react';
import { LEVELS } from '@/utils/constants';
import usePaths from '@/hooks/usePaths';
import Level from './Level';
import styles from './ProgressStepper.module.css';
import { useUser } from '@/hooks/useUser';
import { useSteps } from '@/hooks/useSteps';


const ProgressStepper: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paths = usePaths(LEVELS, activeLevel, containerRef, styles.connector, styles.active, styles.back);

  const { data: user, error: userError } = useUser();
  const { data: steps, error: stepsError } = useSteps();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  if (userError || stepsError) {
    return <div>Error loading data.</div>;
  }

  if (!user || steps?.length === 0) {
    return <div>Loading...</div>;
  }

  console.log({user}, {steps})

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
