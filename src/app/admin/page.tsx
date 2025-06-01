import { AdminGuard } from '@/components/auth/AdminGuard';
import { TaskManagement } from '@/components/admin/TaskManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { requireAuth } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage() {
  // Only check for basic authentication on server
  const session = await requireAuth();
  const t = await getTranslations('admin');
  
  return (
    <AdminGuard>
      <div className="w-full p-6">
        <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
        <p className="mb-4">
          {t('welcome', { name: session.user.name })}
        </p>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="users">{t('tabs.users')}</TabsTrigger>
            <TabsTrigger value="tasks">{t('tabs.tasks')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <TaskManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}
