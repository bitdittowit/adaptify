import { CheckCheck, CircleDashed, LockKeyholeOpen } from 'lucide-react';

import { STATUS } from '@/types';

export function TaskStatus({ status }: { status: STATUS }) {
    return (
        <>
            {status === STATUS.OPEN && <LockKeyholeOpen />}
            {status === STATUS.PENDING && <CircleDashed />}
            {status === STATUS.FINISHED && <CheckCheck />}
        </>
    );
}
