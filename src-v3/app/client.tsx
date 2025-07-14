"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const Client = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery(trpc.threads.getMany.queryOptions({}));

  const createThread = useMutation(
    trpc.threads.create.mutationOptions({
      onSuccess: (thread) => {
        console.debug("Thread created successfully:", thread.id);
        // Invalidate the threads query to refresh the list
        queryClient.invalidateQueries(trpc.threads.getMany.queryOptions({}));

        toast.success("Thread created successfully!", {
          description: `Thread ID: ${thread.id}`,
        });
      },
      onError: (error) => {
        console.error("Error creating thread:", error);
      },
    })
  );

  return (
    <div className="space-y-4">
      <Button onClick={() => createThread.mutate({ userId: "123" })}>
        Create Thread
      </Button>
      <Badge>{data?.length ?? 0} threads</Badge>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
