import { Level } from "@/types";

const leftPositions = [
  '50%', '90%', '10%', '50%', '90%', '10%',
  '50%', '10%', '50%', '90%', '90%', '10%',
  '50%', '90%', '50%', '10%', '10%', '90%',
  '10%', '50%'
];

const calculateStep = (): number => {
  const screenWidth = window.innerWidth;
  let step = 100;

  if (screenWidth > 720) {
    const maxScreenWidth = 1024;
    const minScreenWidth = 720;
    const maxStep = 200;

    if (screenWidth <= maxScreenWidth) {
      const ratio = (screenWidth - minScreenWidth) /
          (maxScreenWidth - minScreenWidth);
      step = 100 + ratio * (maxStep - 100);
    } else {
      step = maxStep;
    }
  }

  return step;
};

export const STEP = calculateStep();

const createLevels = (count: number): Level[] => {
  const levels: Level[] = [];

  for (let i = 0; i < count; i++) {
    const id = i + 1;
    const bottom = 20 + i * STEP;
    const left = leftPositions[i % leftPositions.length];

    levels.push({ id, position: { bottom, left } });
  }

  return levels;
};

export const LEVELS = createLevels(20);
