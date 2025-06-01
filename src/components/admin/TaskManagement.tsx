'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TaskManagement() {
  const t = useTranslations('admin.tasks');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="p-6 border rounded-md text-center">
            <h3 className="text-xl font-medium mb-2">{t('comingSoon')}</h3>
            <p className="text-muted-foreground">
              {t('comingSoonDescription')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 