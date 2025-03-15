'use client';

import { useTranslations } from 'next-intl';

import {
    Award,
    BadgeCheck,
    Calendar,
    GraduationCap,
    Mail,
    MapPin,
    School,
    Star,
    Target,
    Trophy,
    User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetUserLevelSummary } from '@/hooks/api/entities/users/use-get-user-level-summary';
import { useSession } from '@/hooks/use-session';

const achievements = [
    {
        id: 'firstSteps',
        icon: Star,
        unlocked: true,
    },
    {
        id: 'excellent',
        icon: Trophy,
        unlocked: true,
    },
    {
        id: 'purposeful',
        icon: Target,
        unlocked: false,
    },
    {
        id: 'master',
        icon: Award,
        unlocked: false,
    },
];

export default function ProfilePage() {
    const t = useTranslations('profile');
    const sidebarT = useTranslations('sidebar');
    const { user } = useSession();
    const { data: levelSummary } = useGetUserLevelSummary();

    if (!user) {
        return null;
    }

    const initials = user.name
        ?.split(' ')
        .map(n => n[0])
        .join('');

    const currentLevel = levelSummary?.level ?? 1;
    const currentExperience = levelSummary?.experience ?? 0;
    const nextLevelExperience = currentLevel * 200;
    const progressPercentage = (currentExperience / nextLevelExperience) * 100;

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                {/* Левая колонка с основной информацией */}
                <div className="space-y-6">
                    <Card className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <BadgeCheck className="h-6 w-6 text-primary" />
                                {sidebarT('profile')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <Avatar className="h-32 w-32 ring-4 ring-background">
                                        {user.image && <AvatarImage src={user.image} alt={user?.name ?? 'Name'} />}
                                        <AvatarFallback className="text-4xl bg-primary/10">{initials}</AvatarFallback>
                                    </Avatar>
                                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2" variant="secondary">
                                        {t('level')} {currentLevel}
                                    </Badge>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <p className="text-muted-foreground">{user.email}</p>
                                </div>
                                <Button className="w-full" variant="outline">
                                    {t('editProfile')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                {t('learningProgress')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-bold">{currentLevel}</div>
                                    <div className="text-sm text-muted-foreground">{t('currentLevel')}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{currentExperience}</div>
                                    <div className="text-sm text-muted-foreground">{t('experiencePoints')}</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>{t('progressToLevel', { level: currentLevel + 1 })}</span>
                                    <span>
                                        {currentExperience}/{nextLevelExperience} XP
                                    </span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Правая колонка с деталями */}
                <div className="space-y-6">
                    <Tabs defaultValue="info" className="w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="info" className="flex-1">
                                {t('tabs.info')}
                            </TabsTrigger>
                            <TabsTrigger value="achievements" className="flex-1">
                                {t('tabs.achievements')}
                            </TabsTrigger>
                            <TabsTrigger value="stats" className="flex-1">
                                {t('tabs.stats')}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="info" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        {t('personalInfo.title')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4">
                                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t('personalInfo.name')}
                                                </div>
                                                <div className="font-medium">{user.name}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                                            <Mail className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t('personalInfo.email')}
                                                </div>
                                                <div className="font-medium">{user.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                                            <School className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t('personalInfo.studyGroup')}
                                                </div>
                                                <div className="font-medium">КИ21-22Б</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t('personalInfo.country')}
                                                </div>
                                                <div className="font-medium">Казахстан</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">
                                                    {t('personalInfo.arrivalDate')}
                                                </div>
                                                <div className="font-medium">1 сентября 2024</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="achievements" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        {t('achievements.title')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        {achievements.map(achievement => {
                                            const Icon = achievement.icon;
                                            return (
                                                <div
                                                    key={achievement.id}
                                                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                                                        achievement.unlocked
                                                            ? 'bg-primary/5 border-primary/20'
                                                            : 'bg-muted/50 opacity-50'
                                                    }`}
                                                >
                                                    <div
                                                        className={`rounded-full p-2 ${
                                                            achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                                                        }`}
                                                    >
                                                        <Icon
                                                            className={`h-6 w-6 ${
                                                                achievement.unlocked
                                                                    ? 'text-primary'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {t(`achievements.${achievement.id}.title`)}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {t(`achievements.${achievement.id}.description`)}
                                                        </div>
                                                    </div>
                                                    {achievement.unlocked && (
                                                        <Badge variant="secondary" className="ml-auto">
                                                            {t('achievements.unlocked')}
                                                        </Badge>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="stats" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5 text-primary" />
                                        {t('stats.title')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-lg border bg-card/50 text-center">
                                            <GraduationCap className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <div className="text-2xl font-bold">24</div>
                                            <div className="text-sm text-muted-foreground">
                                                {t('stats.tasksCompleted')}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg border bg-card/50 text-center">
                                            <BadgeCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <div className="text-2xl font-bold">{currentExperience}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {t('stats.experienceEarned')}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-lg border bg-card/50 text-center">
                                            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <div className="text-2xl font-bold">14</div>
                                            <div className="text-sm text-muted-foreground">
                                                {t('stats.daysInSystem')}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
