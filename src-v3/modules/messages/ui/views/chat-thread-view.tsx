"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "@/modules/threads/ui/components/message-item";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface ChatThreadProps {
  threadId: string;
}

export function ChatThreadView({ threadId }: ChatThreadProps) {
  const trpc = useTRPC();

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getByThread.queryOptions({ threadId: threadId })
  );

  // Split the username by spaces and take the first word
  const username = "Example User";
  const firstName = username?.split(" ")[0];

  /** Generate a greeting message based on the user's first name. */
  const getGreeting = useMemo(() => {
    // Generic greeting message
    const genericGreeting = "How can I assist?";

    // Personalised greeting messages
    const greetings = [
      `How can I help, ${firstName}?`,
      `What's on your mind, ${firstName}?`,
      `What can I do for you?`,
    ];

    if (firstName) {
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    return genericGreeting;
  }, [firstName]);

  // if (!threadId || !messages) {
  //   return (
  //     <div className="flex flex-1 flex-col gap-4 text-center items-center justify-end md:justify-center -mt-4 min-h-full">
  //       <div className="space-y-2 flex flex-col items-center">
  //         <Image
  //           src="/ai-icon.png"
  //           width={64}
  //           height={64}
  //           alt="Logo"
  //           className="mb-4"
  //         />
  //         <h1 className="text-2xl">{getGreeting}</h1>
  //         <h2 className="text-muted-foreground">
  //           Ask me anything or upload a file to get started.
  //         </h2>
  //       </div>
  //       <form>
  //         TODO: Chat Input
  //       </form>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="overflow-y-auto p-4 pb-8">
        <ScrollArea className="mx-auto flex flex-1 max-w-3xl" type="always">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem key={message.id} {...message} />
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="p-1 pt-0">{/* TODO: Chat Input */}</div>
    </div>
  );
}
