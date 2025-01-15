import type { BaseTask } from '@/types';

function updateTaskDependencies(tasks: BaseTask[]): BaseTask[] {
    const taskMap = new Map<number, BaseTask>();

    for (const task of tasks) {
        taskMap.set(task.id, task);
    }

    // Update blocked_by dependencies.
    const updateBlockedBy = (taskId: number, visited = new Set<number>()) => {
        if (visited.has(taskId)) {
            return;
        }
        visited.add(taskId);

        const task = taskMap.get(taskId);
        if (!task) {
            return;
        }

        for (const blockedById of task.blocked_by) {
            updateBlockedBy(blockedById, visited);

            const parentTask = taskMap.get(blockedById);
            if (!parentTask) {
                continue;
            }

            for (const parentDependency of parentTask.blocked_by) {
                if (!task.blocked_by.includes(parentDependency)) {
                    task.blocked_by.push(parentDependency);
                }
            }
        }
    };

    // Update blocks dependencies.
    const updateBlocks = (taskId: number, visited = new Set<number>()) => {
        if (visited.has(taskId)) {
            return;
        }
        visited.add(taskId);

        const task = taskMap.get(taskId);
        if (!task) {
            return;
        }

        for (const blocksId of task.blocks) {
            updateBlocks(blocksId, visited);

            const childTask = taskMap.get(blocksId);
            if (!childTask) {
                continue;
            }

            for (const childDependency of childTask.blocks) {
                if (!task.blocks.includes(childDependency)) {
                    task.blocks.push(childDependency);
                }
            }
        }
    };

    for (const task of tasks) {
        for (const blockedById of task.blocked_by) {
            const blockedTask = taskMap.get(blockedById);
            if (blockedTask && !blockedTask.blocks.includes(task.id)) {
                blockedTask.blocks.push(task.id);
            }
        }
    }

    for (const task of tasks) {
        updateBlockedBy(task.id);
        updateBlocks(task.id);
    }

    return tasks;
}

export default updateTaskDependencies;
