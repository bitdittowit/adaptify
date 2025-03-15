import { describe, expect, it } from '@jest/globals';

import type { BaseTask } from '@/types';
import updateTaskDependencies from '@/utils/backend-potential/update-task-dependencies';

function createTask(
    id: number,
    title: string,
    position: number,
    blocks: number[] = [],
    blockedBy: number[] = [],
): BaseTask {
    return {
        id,
        title: {
            ru: title,
            en: title,
        },
        description: {
            ru: '',
            en: '',
        },
        required: true,
        position,
        blocks,
        blocked_by: blockedBy,
        tags: [],
        schedule: null,
        proof: null,
        documents: null,
        links: null,
        address: null,
        contacts: null,
        priority: 0,
        deadline_days: null,
        duration_minutes: 0,
    };
}

const mockTasks: BaseTask[] = [
    // Test should correctly fill blocked_by and blocks fields.
    createTask(1, 'Task 1', 1, [], [2]),
    createTask(2, 'Task 2', 2),
    createTask(3, 'Task 3', 3, [], [2]),
    // Test should handle tasks with no dependencies.
    createTask(4, 'Task 4', 4),
    createTask(5, 'Task 5', 5),
    // Test should handle cyclic dependencies gracefully.
    createTask(6, 'Task 6', 6, [], [7]),
    createTask(7, 'Task 7', 7, [], [6]),
    // Test should correctly fill blocked_by and blocks fields in recursion.
    createTask(8, 'Task 8', 8),
    createTask(9, 'Task 9', 9, [], [8]),
    createTask(10, 'Task 10', 10, [], [9]),
    createTask(11, 'Task 11', 11, [], [10]),
];

describe('fillBlockingFields', () => {
    it('should correctly fill blocked_by and blocks fields', () => {
        const tasks = mockTasks.slice(0, 3);

        updateTaskDependencies(tasks);

        expect(tasks[0].blocked_by).toEqual([2]);
        expect(tasks[0].blocks).toEqual([]);

        expect(tasks[1].blocked_by).toEqual([]);
        expect(tasks[1].blocks).toEqual([1, 3]);

        expect(tasks[2].blocked_by).toEqual([2]);
        expect(tasks[2].blocks).toEqual([]);
    });

    it('should handle tasks with no dependencies', () => {
        const tasks = mockTasks.slice(3, 5);

        updateTaskDependencies(tasks);

        expect(tasks[0].blocked_by).toEqual([]);
        expect(tasks[0].blocks).toEqual([]);

        expect(tasks[1].blocked_by).toEqual([]);
        expect(tasks[1].blocks).toEqual([]);
    });

    it('should handle cyclic dependencies gracefully', () => {
        const tasks = mockTasks.slice(5, 7);

        updateTaskDependencies(tasks);

        expect(tasks[0].blocked_by).toContain(7);
        expect(tasks[0].blocks).toContain(7);
        expect(tasks[1].blocked_by).toContain(6);
        expect(tasks[1].blocks).toContain(6);
    });

    it('should correctly fill blocked_by and blocks fields in recursion', () => {
        const tasks = mockTasks.slice(7);

        updateTaskDependencies(tasks);

        expect(tasks[0].blocked_by).toEqual([]);
        expect(tasks[0].blocks).toEqual([9, 10, 11]);

        expect(tasks[1].blocked_by).toEqual([8]);
        expect(tasks[1].blocks).toEqual([10, 11]);

        expect(tasks[2].blocked_by).toContain(8);
        expect(tasks[2].blocked_by).toContain(9);
        expect(tasks[2].blocks).toEqual([11]);

        expect(tasks[3].blocked_by).toContain(8);
        expect(tasks[3].blocked_by).toContain(9);
        expect(tasks[3].blocked_by).toContain(10);
        expect(tasks[3].blocks).toEqual([]);
    });
});
