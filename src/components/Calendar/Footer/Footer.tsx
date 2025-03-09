import { LocalizedText } from '@/components/ui/localized-text';
import type { Task } from '@/types';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

interface FooterProps {
    tasks?: Task[];
    displayMonth?: Date;
}

export const Footer = ({ tasks, displayMonth }: FooterProps) => {
    const getDay = (date: Date) => DAYS[date.getDay()];

    return (
        <tfoot className="footer">
            {tasks?.map(({ title, id, schedule }) => (
                <tr key={id}>
                    <td>
                        <LocalizedText text={title} />:{' '}
                        <b>{schedule?.[getDay(displayMonth || new Date())]?.join(', ')}</b>
                    </td>
                </tr>
            ))}
        </tfoot>
    );
};
