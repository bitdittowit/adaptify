import { useTranslations } from 'next-intl';

import { CheckCheck, CircleDashed, LockKeyholeOpen } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { STATUS } from '@/types';

interface TaskStatusProps {
    status: STATUS;
    className?: string;
}

export function TaskStatus({ status, className }: TaskStatusProps) {
    const t = useTranslations();

    const variants = {
        [STATUS.OPEN]: {
            icon: LockKeyholeOpen,
            variant: 'outline' as const,
            className: 'text-muted-foreground',
        },
        [STATUS.PENDING]: {
            icon: CircleDashed,
            variant: 'secondary' as const,
            className: 'text-orange-500',
        },
        [STATUS.FINISHED]: {
            icon: CheckCheck,
            variant: 'default' as const,
            className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
        },
    };

    const { icon: Icon, variant, className: variantClassName } = variants[status];

    return (
        <Badge variant={variant} className={cn('gap-1', variantClassName, className)}>
            <Icon className="h-3.5 w-3.5" />
            <span>{t(`task.status.${status}`)}</span>
        </Badge>
    );
}
