import type { Level } from '@/types';

export const STEP = 60;
const leftOffsetBorder = 10;
const rightOffsetBorder = 90;

const createLevels = (count: number, step = 10): Level[] => {
    const levels: Level[] = [];
    let leftOffset = 50;
    let increasing = true;

    for (let i = 0; i < count; i++) {
        const id = i + 1;
        const bottom = 20 + i * STEP;

        levels.push({ id, position: { bottom, left: `${leftOffset}%` } });

        if (leftOffset >= rightOffsetBorder) {
            increasing = false;
        } else if (leftOffset <= leftOffsetBorder) {
            increasing = true;
        }

        if (increasing) {
            leftOffset += step;
        } else {
            leftOffset -= step;
        }
    }

    return levels;
};

const leftOffsetStep = window.innerWidth > 720 ? 8 : 20;

export const LEVELS = createLevels(20, leftOffsetStep);
