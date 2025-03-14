import { useTranslations } from 'next-intl';

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
    const t = useTranslations();
    const tCalendar = useTranslations('calendar');
    const getDay = (date: Date) => DAYS[date.getDay()];
    const breakpoint = useBreakpoint();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

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
                                className="overflow-hidden shadow-sm hover:shadow transition-shadow duration-200"
                            >
                                <CardContent className={isMobile ? 'p-2' : 'p-3'}>
                                    <div className="flex justify-between items-start">
                                        <div className="mr-2">
                                            <h4
                                                className={`font-medium line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm md:text-base'}`}
                                            >
                                                <LocalizedText text={title} />
                                            </h4>

                                            {timeRanges && timeRanges.length > 0 ? (
                                                <div
                                                    className={`flex items-center mt-1 text-muted-foreground ${isMobile ? 'text-[0.65rem]' : 'text-xs md:text-sm'}`}
                                                >
                                                    <Clock className={isMobile ? 'w-2 h-2 mr-0.5' : 'w-3 h-3 mr-1'} />
                                                    <span>{timeRanges.join(', ')}</span>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`text-muted-foreground mt-1 ${isMobile ? 'text-[0.65rem]' : 'text-xs md:text-sm'}`}
                                                >
                                                    {t('task.noSchedule')}
                                                </div>
                                            )}
                                        </div>

                                        <Badge
                                            variant="secondary"
                                            className={`shrink-0 ${isMobile ? 'text-[0.65rem] px-1.5 py-0' : ''}`}
                                        >
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
