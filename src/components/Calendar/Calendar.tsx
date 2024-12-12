'use client'
import { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { ru } from "date-fns/locale/ru";
import Holidays from 'date-holidays'


const holidays = new Holidays('RU');


const Calendar = ({ }) => {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <CalendarUI
            mode="single"
            selected={date}
            today={new Date()}
            onSelect={setDate}
            className="rounded-md border"
            showOutsideDays={true}
            weekStartsOn={1}
            locale={ru}
            modifiers={{
                weekend: (day: Date) => day.getDay() === 0 || day.getDay() === 6 || Boolean(holidays.isHoliday(day)),
            }}
            modifiersClassNames={{
                weekend: "text-red-500",
            }}
            classNames={{
                day_today: "border-2 border-zinc-950",
                day_outside: "text-gray-200",
            }}
        // footer={
        //     selected
        //       ? `You picked ${selected.toLocaleDateString()}.`
        //       : "Please pick a date."
        //   }
        />
    )
}

export default Calendar;