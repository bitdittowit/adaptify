import { daysOfWeek } from "@/app/constants/daysOfWeek";
import { Schedule } from "@/types";

interface ScheduleBadgeProps {
  schedule: Schedule;
};

export function ScheduleBadge({ schedule }: ScheduleBadgeProps) {
  return (
    <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
      {daysOfWeek.map((day) => (
        <div key={day} className="flex-1">
          <p className="text-sm font-medium leading-none">{day}</p>
          {schedule[day].length > 0 ? (
            <ul className="list-none">
              {schedule[day].map((timeRange, index) => (
                <li key={index} className="text-sm">
                  {timeRange}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Неприемный день</p>
          )}
        </div>
      ))}
    </div>
  );
}