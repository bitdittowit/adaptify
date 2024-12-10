import { parse, format, addDays, isAfter } from 'date-fns';
import { Schedule } from '@/types';
import { daysOfWeek } from '@/app/constants/daysOfWeek';

export default function getNextAvailableDate(
  schedule: Schedule,
  currentDate: Date,
): Date {
  for (let i = 0; i < 7; i++) {
    const dateToCheck = addDays(currentDate, i);
    console.log('dateToCheck', dateToCheck)
    const dayOfWeek = daysOfWeek[dateToCheck.getDay()];
    console.log('dayOfWeek', dayOfWeek)

    if (schedule[dayOfWeek] && schedule[dayOfWeek].length > 0) {
      for (const timeRange of schedule[dayOfWeek]) {
        const [startTime, endTime] = timeRange.split('-');
        console.log('startTime', startTime)
        const startDateTime = parse(
          `${format(dateToCheck, 'yyyy-MM-dd')} ${startTime}`,
          'yyyy-MM-dd HH:mm',
          new Date(),
        );
        console.log('startDateTime', startDateTime)

        if (isAfter(startDateTime, currentDate)) {
          return startDateTime;
        }
      }
    }
  }

  throw new Error('No available future date found in schedule.');
}
