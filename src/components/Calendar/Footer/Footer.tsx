import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ArrowUpDown, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LocalizedText } from '@/components/ui/localized-text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBreakpoint } from '@/hooks/use-mobile';
import type { Task } from '@/types';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

interface FooterProps {
    tasks?: Task[];
    displayMonth?: Date;
}

export const Footer = ({ tasks, displayMonth }: FooterProps) => {
    const tCalendar = useTranslations('calendar');
    const getDay = (date: Date) => DAYS[date.getDay()];
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
    const router = useRouter();

    if (!tasks?.length) {
        return null;
    }

    return (
        <div className="mt-4 w-full">
            <h3 className="font-medium text-lg mb-3 flex items-center">
                {tCalendar('tasks')} ({tasks.length})
                {tasks.length > 3 && isMobile && (
                    <span className="text-xs ml-2 text-muted-foreground flex items-center">
                        <ArrowUpDown className="h-3 w-3 mr-1" />
                        Прокрутите для просмотра
                    </span>
                )}
            </h3>
            <ScrollArea className={`tasks-container ${isMobile ? 'max-h-[250px]' : 'max-h-[300px]'}`}>
                <div className="space-y-2 pr-4">
                    {tasks.map(({ title, id, schedule, experience_points }) => {
                        const day = getDay(displayMonth || new Date());
                        const timeRanges = schedule?.[day];

                        return (
                            <Card
                                key={id}
                                onClick={() => router.push(`/tasks/id/${id}`)}
                                className="overflow-hidden shadow-sm hover:shadow transition-shadow duration-200 cursor-pointer"
                            >
                                <CardContent className={isMobile ? 'p-2' : 'p-3'}>
                                    <div className="flex justify-between items-start">
                                        <div className="mr-2">
                                            <h4
                                                className={`font-medium line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm md:text-base'}`}
                                            >
                                                <LocalizedText text={title} />
                                            </h4>
                                            {timeRanges && timeRanges.length > 0 && (
                                                <div className="flex items-center mt-1 text-muted-foreground">
                                                    <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                                                    <span className={isMobile ? 'text-xs' : 'text-sm'}>
                                                        {timeRanges.join(', ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <Badge variant="secondary" className={isMobile ? 'text-xs' : 'text-sm'}>
                                            {experience_points} XP
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};
