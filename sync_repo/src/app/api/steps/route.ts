import { Step } from "@/types";
import { calculateDates } from "@/utils/calculateDates";
import { NextRequest, NextResponse } from "next/server";

const STEPS_VISA_FREE: Step[] = [
  {
    id: 1,
    tasks: [
      {
        description: 'This is the detailed description of task 1 for visa-free countries.',
        short_description: 'Task 1 short description',
        start_date: new Date(),
        end_date: new Date(),
      },
    ],
  },
];

const STEPS_VISA: Step[] = [
  {
    id: 1,
    tasks: [
      {
        description: 'This is the detailed description of task 1 for visa-required countries.',
        short_description: 'Task 1 short description',
        start_date: new Date(),
        end_date: new Date(),
      },
    ],
  },
];

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const date = url.searchParams.get("date");
  const countryVisaType = url.searchParams.get("visa_type");
  const arrivalDate = new Date(url.searchParams.get("arrival_date") ?? "");

  const steps = countryVisaType === "visa-free" ? STEPS_VISA_FREE : STEPS_VISA;

  calculateDates(arrivalDate, steps);

  if (id) {
    const step = steps.find((s) => s.id === Number(id));
    return NextResponse.json(step ?? {});
  }

  if (date) {
    const targetDate = new Date(date);
    const filteredSteps = steps.filter((step) =>
      step.tasks.some(
        (task) =>
          targetDate >= task.start_date && targetDate <= task.end_date
      )
    );
    return NextResponse.json(filteredSteps);
  }

  return NextResponse.json(steps);
}
