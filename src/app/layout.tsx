import type { Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import '@/styles/index.css';

export const metadata: Metadata = {
  title: "Adaptify",
  description: "Adaptify app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex min-h-[100vh] flex-1 items-center justify-center relative rounded-xl bg-muted/50 md:min-h-min">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      </body>
    </html>
  );
}
