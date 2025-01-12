import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { AppSidebar } from '@/components/app-sidebar';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import '@/styles/index.css';

import './globals.css';

export const metadata: Metadata = {
    title: 'Adaptify',
    description: 'Adaptify app',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>
                            <header className="flex h-16 shrink-0 items-center gap-2">
                                <div className="flex gap-2 px-4 w-full justify-between">
                                    <div className="left flex items-center">
                                        <SidebarTrigger className="-ml-1" />
                                        <Separator orientation="vertical" className="mr-2 h-4" />
                                    </div>
                                    <div className="right flex items-center">
                                        <LanguageSwitcher />
                                    </div>
                                </div>
                            </header>
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                <div className="flex min-h-[100vh] flex-1 items-center justify-center relative rounded-xl bg-muted/50 md:min-h-min">
                                    {children}
                                </div>
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
