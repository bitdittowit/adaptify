import type { FC } from 'react';
import * as React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useGetUserLevelSummary } from '@/hooks/api/entities/users/use-get-user-level-summary';
import type { Position } from '@/types';

import styles from './road-map.module.css';

interface LevelProps {
    id: number;
    position: Position;
    isActive: boolean;
}

const Level: FC<LevelProps> = ({ id, position, isActive }) => {
    const t = useTranslations();
    const { data: userLevelSummary } = useGetUserLevelSummary();
    const [isOpen, setIsOpen] = React.useState(false);

    const currentLevel = userLevelSummary?.level ?? 0;
    const currentExperience = userLevelSummary?.experience ?? 0;
    const experienceNeeded = id * 200 - currentExperience;

    return (
        <>
            <div
                className={`${styles.level} ${isActive ? styles.active : ''}`}
                style={{ ...position, zIndex: -id }}
                onClick={() => setIsOpen(true)}
            >
                <div className={`${styles.cubeFace} ${styles.cubeFaceFront}`} />
                <div className={`${styles.cubeFace} ${styles.cubeFaceBack}`} />
                <div className={`${styles.cubeFace} ${styles.cubeFaceRight}`} />
                <div className={`${styles.cubeFace} ${styles.cubeFaceLeft}`} />
                <div className={`${styles.cubeFace} ${styles.cubeFaceTop}`}>
                    <div className={styles.levelNumber}>{id}</div>
                </div>
                <div className={`${styles.cubeFace} ${styles.cubeFaceBottom}`} />
            </div>

            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {id > currentLevel
                                ? t('level.nextLevel', { level: id })
                                : t('level.congratulations', { level: id })}
                        </DrawerTitle>
                        <DrawerDescription>
                            {id > currentLevel
                                ? t('level.experienceNeeded', { experience: experienceNeeded })
                                : t('level.unlocked')}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 flex justify-center">
                        <Button asChild>
                            <Link href="/tasks">{t('level.viewTasks')}</Link>
                        </Button>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Level;
