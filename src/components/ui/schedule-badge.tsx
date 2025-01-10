import { daysOfWeek } from '@/app/constants/daysOfWeek';
import type { Schedule } from '@/types';

interface ScheduleBadgeProps {
    schedule: Schedule;
}

export function ScheduleBadge({ schedule }: ScheduleBadgeProps) {
    return (
        <div className="border p-4 rounded-md grid gap-4">
            <h2 className="text-gray-700 font-semibold leading-none tracking-tight">Расписание</h2>
            <div className="grid grid-cols-2 gap-4">
                {daysOfWeek.map(day => (
                    <div key={day} className="flex-1">
                        <p className="text-sm font-medium leading-none">{day}</p>
                        {schedule[day].length > 0 ? (
                            <ul className="list-none">
                                {schedule[day].map((timeRange, index) => (
                                    //biome-ignore lint/suspicious/noArrayIndexKey: idk
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
        </div>
    );
}
