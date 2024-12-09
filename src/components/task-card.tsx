import { CalendarClock, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Status, UserTask } from "@/types"
import { useApiPost } from "@/hooks/api/useApiPost"
import { TaskStatus } from "@/components/task-status"

type TaskCardProps = React.ComponentProps<typeof Card> & { task: UserTask };

function formatDate(isoDate: string) {
  const date = new Date(isoDate);

  const formatter = new Intl.DateTimeFormat(
    'ru-RU',
    { day: '2-digit', month: 'long' },
  );

  return formatter.format(date);
}

export function TaskCard({ className, task,  ...props }: TaskCardProps) {
  const { postData } = useApiPost<{ id: number }>();

  const markAsDone = async () => {
    const data = { id: task.id };
    const result = await postData('/api/tasks/finish', data);
    if (result) {
      console.log('User experience updated:', result);
      task.status = Status.FINISHED;
    }
  };

  return (
    <Card className={cn("w-[380px] h-[max-content]", className)} {...props}>
      <CardContent className="grid gap-4 mt-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <CalendarClock />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {formatDate(task.picked_date as string)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardHeader className="mt-[-40px] flex">
        <CardTitle className="mb-1">{task.title}</CardTitle>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardFooter className="gap-4">
        <TaskStatus status={task.status} />
        {task.status !== Status.FINISHED &&
          <Button className="w-full" onClick={markAsDone}>
              <Check /> Mark as done
            </Button>
        }
      </CardFooter>
    </Card>
  )
}
