"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThreadGroup } from "@/modules/threads/ui/components/thread-item-group";
import { isBookmarked } from "@/modules/threads/utils";
import { useTRPC } from "@/trpc/client";
import { AgentThread } from "@azure/ai-agents";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isToday, isYesterday, subDays } from "date-fns";
import {
  ArrowLeft,
  ChartLineIcon,
  Cog,
  MessageSquarePlus,
  SparkleIcon,
} from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { HomeNavigator } from "./home-navigator";

export type ThreadMenuItem = {
  id: string;
  name: string;
  date: Date;
  isBookmarked?: boolean;
  isContentSafetyTriggered?: boolean;
  userId: string;
};

interface AppSidebarProps {
  props?: React.ComponentProps<typeof Sidebar>;
}

function categorizeThreads(threads: AgentThread[]) {
  const bookmarks: AgentThread[] = [];
  const today: AgentThread[] = [];
  const yesterday: AgentThread[] = [];
  const last7Days: AgentThread[] = [];
  const older: AgentThread[] = [];

  threads.forEach((thread) => {
    const bookmarked = isBookmarked(thread);
    if (bookmarked) {
      bookmarks.push(thread);
    } else if (isToday(thread.createdAt)) {
      today.push(thread);
    } else if (isYesterday(thread.createdAt)) {
      yesterday.push(thread);
    } else if (thread.createdAt >= subDays(new Date(), 7)) {
      last7Days.push(thread);
    } else {
      older.push(thread);
    }
  });

  return { bookmarks, today, yesterday, last7Days, older };
}

const EmptyThreads = () => {
  return (
    <div className="text-center text-muted-foreground flex flex-col items-center gap-4 mt-8">
      <div className="flex flex-row items-center gap-2">
        <MessageSquarePlus className="size-8" />
        <h2 className="text-lg font-semibold">No Threads</h2>
      </div>
      <p>Start a new thread to get the conversation going.</p>
    </div>
  );
};

export function AppSidebar({ props }: AppSidebarProps) {
  const trpc = useTRPC();
  const { data: threads } = useSuspenseQuery(
    trpc.threads.getMany.queryOptions({})
  );

  const { bookmarks, today, yesterday, last7Days, older } =
    categorizeThreads(threads);

  const isMobile = useIsMobile();

  const segment = useSelectedLayoutSegment();
  const isSettings = segment === "settings";

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <HomeNavigator />
        {/* <SearchForm /> */}
      </SidebarHeader>
      {!isSettings ? (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Agents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="flex flex-row gap-2">
                    <SparkleIcon className="size-4 text-muted-foreground" />
                    Researcher
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className="flex flex-row gap-2">
                    <ChartLineIcon className="size-4 text-muted-foreground" />
                    Analyst
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {threads.length === 0 && <EmptyThreads />}

          {bookmarks.length > 0 && (
            <ThreadGroup
              label="Bookmarked"
              threads={bookmarks}
              isMobile={isMobile}
            />
          )}
          {today.length > 0 && (
            <ThreadGroup label="Today" threads={today} isMobile={isMobile} />
          )}
          {yesterday.length > 0 && (
            <ThreadGroup
              label="Yesterday"
              threads={yesterday}
              isMobile={isMobile}
            />
          )}
          {last7Days.length > 0 && (
            <ThreadGroup
              label="Last 7 Days"
              threads={last7Days}
              isMobile={isMobile}
            />
          )}
          {older.length > 0 && (
            <ThreadGroup label="Older" threads={older} isMobile={isMobile} />
          )}
        </SidebarContent>
      ) : (
        <SidebarContent />
      )}
      <SidebarFooter>
        {isSettings ? (
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" /> Back to Chat
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href="/settings">
              <Cog className="size-4" /> Admin Console
            </Link>
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
