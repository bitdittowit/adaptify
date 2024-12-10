import { parse, format, addDays, isAfter } from 'date-fns';
import { Schedule } from '@/types';
import { daysOfWeek } from '@/app/constants/daysOfWeek';

export default function getNextAvailableDate(
  schedule: Schedule,
  currentDate: Date,
): Date {
  for (let i = 0; i < 7; i++) {
    const dateToCheck = addDays(currentDate, i);
    const dayOfWeek = daysOfWeek[dateToCheck.getDay()];

    if (schedule[dayOfWeek] && schedule[dayOfWeek].length > 0) {
      for (const timeRange of schedule[dayOfWeek]) {
        const [startTime] = timeRange.split('-');
        const startDateTime = parse(
          `${format(dateToCheck, 'yyyy-MM-dd')} ${startTime}`,
          'yyyy-MM-dd HH:mm',
          new Date(),
        );

        if (isAfter(startDateTime, currentDate)) {
          return startDateTime;
        }
      }
    }
  }

  throw new Error('No available future date found in schedule.');
}
