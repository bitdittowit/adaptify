'use client'
import { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { ru } from "date-fns/locale/ru";




const Calendar = ({}) => {
    const [date, setDate] = useState<Date | undefined>(undefined)
 
return (
  <CalendarUI
    mode="single"
    selected={date}
    today={new Date()}
    onSelect={setDate}
    className="rounded-md border"
    showOutsideDays
    weekStartsOn={1}
    locale={ru}
    modifiers={{
        weekend: {dayOfWeek: [0, 6]}
    }}
    modifiersClassNames={{
        weekend: "day_weekend"
      }}
    onDayClick={(date, modifiers) => {
        if (modifiers.weekend) {
          alert("This day is already booked.");
        }
      }}
      classNames={{
        day_weekend: "bg-red-500 text-white"
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