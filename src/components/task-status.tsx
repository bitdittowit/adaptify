import { Status } from "@/types"
import { CheckCheck, CircleDashed, LockKeyholeOpen } from "lucide-react"

export function TaskStatus({ status }: { status: Status }) {
  return (
    <>
      {status === Status.OPEN && <LockKeyholeOpen/>}
      {status === Status.PENDING && <CircleDashed/>}
      {status === Status.FINISHED && <CheckCheck/>}
    </>
  )
}
