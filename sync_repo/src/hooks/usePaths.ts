import { calculatePathType, calculatePosition, createPath } from '@/utils/connectors';
import { useEffect, useState, RefObject } from 'react';

interface Level {
  id: number;
  position: { bottom: number; left: string };
}

const usePaths = (
  levels: Level[],
  activeLevel: number,
  containerRef: RefObject<HTMLDivElement>,
  pathClassName?: string,
  activePathClassName?: string,
  activeBackPathClassName?: string,
) => {
  const [paths, setPaths] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const updatePaths = () => {
      if (!containerRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;

      const newPaths = levels.slice(0, -1).map((_, index) => {
        const currentEndPointPosition = levels[index].position;
        const nextEndPointPosition = levels[index + 1].position;

        const pathType = calculatePathType(
          currentEndPointPosition.left,
          nextEndPointPosition.left,
        );

        const start = calculatePosition(currentEndPointPosition, offsetWidth, offsetHeight);
        const end = calculatePosition(nextEndPointPosition, offsetWidth, offsetHeight);
        const isActive = index < activeLevel - 1;

        return createPath(
            {start, end},
            pathType,
            {
              isActive,
              key: index,
              pathClassName,
              activePathClassName,
              activeBackPathClassName,
            }
          );
      });

      setPaths(newPaths);
    };

    updatePaths();
    window.addEventListener('resize', updatePaths);

    return () => {
      window.removeEventListener('resize', updatePaths);
    };
  }, [activeLevel, containerRef, levels, pathClassName, activePathClassName, activeBackPathClassName]);

  return paths;
};

export default usePaths;
