import { AppSidebar } from "@/components/app-sidebar";
import Breadcrumbs from "@/components/breadcrumbs";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-dropdown";
import { AI_DESCRIPTION, AI_NAME } from "@/lib/config";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: AI_NAME,
  description: AI_DESCRIPTION,
};

export default async function AuthedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="h-screen max-h-screen flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 bg-background justify-between p-3">
          <div className="flex shrink-0 items-center gap-2 ">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumbs />
          </div>
          <UserDropdown />
        </header>
        <Separator />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SidebarInset>
      {/* <CitationSidebar /> */}
    </SidebarProvider>
  );
}
