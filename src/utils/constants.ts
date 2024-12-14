import type { Level } from '@/types';

const leftPositions = [
    '50%',
    '80%',
    '20%',
    '50%',
    '80%',
    '20%',
    '50%',
    '20%',
    '50%',
    '80%',
    '80%',
    '20%',
    '50%',
    '80%',
    '50%',
    '20%',
    '20%',
    '80%',
    '20%',
    '50%',
];

const calculateStep = (): number => {
    const screenWidth = window.innerWidth;
    let step = 100;

    if (screenWidth > 720) {
        const maxScreenWidth = 1024;
        const minScreenWidth = 720;
        const maxStep = 200;

        if (screenWidth <= maxScreenWidth) {
            const ratio = (screenWidth - minScreenWidth) / (maxScreenWidth - minScreenWidth);
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
