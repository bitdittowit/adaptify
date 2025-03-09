import { useTranslations } from 'next-intl';

import { LocalizedText } from '@/components/ui/localized-text';
import type { Task } from '@/types';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

interface FooterProps {
    tasks?: Task[];
    displayMonth?: Date;
}

export const Footer = ({ tasks, displayMonth }: FooterProps) => {
    const t = useTranslations();
    const getDay = (date: Date) => DAYS[date.getDay()];

    return (
        <tfoot className="footer">
            {tasks?.map(({ title, id, schedule }) => {
                const day = getDay(displayMonth || new Date());
                const timeRanges = schedule?.[day];
                return (
                    <tr key={id}>
                        <td>
                            <LocalizedText text={title} />:
                            <span>{timeRanges ? timeRanges.join(', ') : t('task.noSchedule')}</span>
                        </td>
                    </tr>
                );
            })}
        </tfoot>
    );
};
