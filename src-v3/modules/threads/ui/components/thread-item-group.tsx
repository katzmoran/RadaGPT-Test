import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThreadItemDropdown } from "@/modules/threads/ui/components/thread-item-dropdown";
import { AgentThread } from "@azure/ai-agents";
import Link from "next/link";
import { isBookmarked } from "../../utils";

interface ThreadGroupProps {
  label: string;
  threads: AgentThread[];
  isMobile: boolean;
}

export function ThreadGroup({ label, threads, isMobile }: ThreadGroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {threads.map((thread) => {
            const bookmarked = isBookmarked(thread);

            return (
              <SidebarMenuItem key={thread.id} className="pr-2">
                <SidebarMenuButton asChild>
                  <Link href={`/chat/${thread.id}`}>{thread.id}</Link>
                </SidebarMenuButton>
                <ThreadItemDropdown
                  threadId={thread.id}
                  isMobile={isMobile}
                  bookmarked={bookmarked}
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
