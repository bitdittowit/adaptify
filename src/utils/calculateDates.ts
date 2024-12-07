import { Step } from "@/types";

interface TaskDuration {
  startOffset: number; // Количество дней до начала события со дня прилета.
  duration: number; // Продолжительность задачи в днях.
}

const taskDurations: TaskDuration[] = [
  { startOffset: 0, duration: 5 },
  { startOffset: 6, duration: 3 },
];

// Warning.
// Mutates steps array.
export function calculateDates(arrivalDate: Date, steps: Step[]): void {
  for (const step of steps) {
    for (const [index, task] of step.tasks.entries()) {
      const { startOffset, duration } = taskDurations[index] ?? { startOffset: 0, duration: 0 };

      task.start_date = new Date(arrivalDate);
      task.start_date.setDate(task.start_date.getDate() + startOffset);

      task.end_date = new Date(task.start_date);
      task.end_date.setDate(task.end_date.getDate() + duration);
    }
  }
}
