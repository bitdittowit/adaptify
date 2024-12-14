import type { DayOfWeek, Task } from '@/types';
import { getDay } from 'date-fns';
import type { FooterProps as BaseFooterProps } from 'react-day-picker';
import styles from './Footer.module.css';

type FooterProps = BaseFooterProps & {
    tasks: Pick<Task, 'title' | 'id' | 'schedule'>[];
};

const getDayOfWeek = (date: Date): DayOfWeek => {
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[getDay(date)];
};

export const Footer = ({ tasks, displayMonth }: FooterProps) => {
    return (
        <tfoot className={styles.footer}>
            {tasks?.map(({ title, id, schedule }) => (
                <tr key={id}>
                    <td key={id}>
                        {title}: <b>{schedule?.[getDayOfWeek(displayMonth || new Date())]}</b>
                    </td>
                </tr>
            ))}
        </tfoot>
    );
};
