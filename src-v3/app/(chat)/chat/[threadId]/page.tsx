import { ChatThreadView } from "@/modules/messages/ui/views/chat-thread-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: {
    threadId: Promise<string>;
  };
}

export default async function ThreadPage({ params }: Props) {
  const threadId = await params.threadId;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.threads.getById.queryOptions({ id: threadId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <ChatThreadView threadId={threadId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
