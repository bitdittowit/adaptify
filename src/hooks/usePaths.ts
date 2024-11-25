import { calculatePosition, createPath } from '@/utils/connectors';
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
) => {
  const [paths, setPaths] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const updatePaths = () => {
      if (!containerRef.current) return;
      const { offsetWidth, offsetHeight } = containerRef.current;

      const newPaths = levels.slice(0, -1).map((_, index) => {
        const start = calculatePosition(levels[index].position, offsetWidth, offsetHeight);
        const end = calculatePosition(levels[index + 1].position, offsetWidth, offsetHeight);
        const isActive = index < activeLevel - 1;

        return createPath(start, end, isActive, index, pathClassName, activePathClassName);
      });

      setPaths(newPaths);
    };

    updatePaths();
    window.addEventListener('resize', updatePaths);

    return () => {
      window.removeEventListener('resize', updatePaths);
    };
  }, [activeLevel, containerRef, levels, pathClassName, activePathClassName]);

  return paths;
};

export default usePaths;
