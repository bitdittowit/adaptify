import type { ReactNode } from 'react';

import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { LanguageSwitcher } from '@/components/common/language-switcher';
import { ThemeSwitcher } from '@/components/common/theme-switcher';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/hooks/use-theme';
import '@/styles/index.css';

import './globals.css';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

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
                <AuthProvider>
                    <NextIntlClientProvider messages={messages}>
                        <ThemeProvider>
                            <SidebarProvider>
                                <AppSidebar />
                                <SidebarInset>
                                    <header className="flex h-14 md:h-16 shrink-0 items-center gap-2">
                                        <div className="flex gap-2 px-3 md:px-4 w-full justify-between">
                                            <div className="left flex items-center">
                                                <SidebarTrigger className="-ml-1" />
                                                <Separator orientation="vertical" className="mr-2 h-4" />
                                            </div>
                                            <div className="right flex items-center gap-1 md:gap-2">
                                                <ThemeSwitcher />
                                                <LanguageSwitcher />
                                            </div>
                                        </div>
                                    </header>
                                    <div className="flex flex-1 flex-col gap-2 md:gap-4 p-2 pt-0 md:p-4 md:pt-0">
                                        <div className="flex min-h-[100vh] flex-1 items-center justify-center relative rounded-xl bg-muted/50 md:min-h-min">
                                            {children}
                                        </div>
                                    </div>
                                </SidebarInset>
                            </SidebarProvider>
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
