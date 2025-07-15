"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction } from "@/components/ui/sidebar";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookmarkMinus,
  BookmarkPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface ThreadItemDropdownProps {
  threadId: string;
  isMobile: boolean;
  isBookmarked?: boolean;
}

export const ThreadItemDropdown = ({
  isMobile,
  threadId,
  isBookmarked,
}: ThreadItemDropdownProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteThread = useMutation(
    trpc.threads.delete.mutationOptions({
      onSuccess: (thread) => {
        if (thread.success) {
          toast.success("Thread deleted successfully");
        } else {
          toast.error("Failed to delete thread");
        }

        // Invalidate the threads query to refresh the list
        queryClient.invalidateQueries(trpc.threads.getMany.queryOptions({}));
      },
    })
  );

  const bookmarkThread = useMutation(
    trpc.threads.bookmark.mutationOptions({
      onSuccess: (thread) => {
        if (thread.isBookmarked) {
          toast.success("Thread bookmarked successfully");
        } else {
          toast.success("Bookmark removed successfully");
        }

        // Invalidate the threads query to refresh the list
        queryClient.invalidateQueries(trpc.threads.getMany.queryOptions({}));
      },
      onError: (error) => {
        console.error("Error bookmarking thread:", error);
        toast.error("Failed to bookmark thread");
      },
    })
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover>
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem
          disabled={bookmarkThread.isPending}
          onClick={() => bookmarkThread.mutate({ id: threadId })}
        >
          {isBookmarked ? (
            <>
              <BookmarkMinus className="text-muted-foreground" />
              <span>Remove Bookmark</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="text-muted-foreground" />
              <span>Bookmark</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil className="text-muted-foreground" />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deleteThread.mutate({ id: threadId })}
          disabled={deleteThread.isPending}
          variant="destructive"
        >
          <Trash2 className="text-muted-foreground" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
