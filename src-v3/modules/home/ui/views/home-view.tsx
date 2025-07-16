"use client";

import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ui/shadcn-io/input-ai";
import { ThreadWelcome } from "@/modules/threads/ui/components/thread-welcome";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobeIcon, MicIcon, PlusIcon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";

export const HomeView = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createThread = useMutation(
    trpc.threads.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.threads.getMany.queryOptions({}));
      },
    })
  );

  const createMessage = useMutation(trpc.messages.create.mutationOptions());

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    if (!message || typeof message !== "string") return;

    setIsSubmitting(true);

    try {
      // First create the thread
      const thread = await createThread.mutateAsync({ userId: "12345" }); // TODO: replace once known

      createMessage
        .mutateAsync({
          threadId: thread.id,
          content: message,
        })
        .catch((error) => {
          console.error("Error creating message:", error);
          toast.error("Failed to create message");
        });

      // Redirect immediately after thread creation
      router.push(`/chat/${thread.id}`);
    } catch (error) {
      console.error("Error creating thread:", error);
      toast.error("Failed to create thread");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <ThreadWelcome />
      </div>
      <div className="my-1">
        <AIInput onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <AIInputTextarea name="message" disabled={isSubmitting} />
          <AIInputToolbar>
            <AIInputTools>
              <AIInputButton disabled={isSubmitting}>
                <PlusIcon size={16} />
              </AIInputButton>
              <AIInputButton disabled={isSubmitting}>
                <MicIcon size={16} />
              </AIInputButton>
              <AIInputButton disabled={isSubmitting}>
                <GlobeIcon size={16} />
                <span>Search</span>
              </AIInputButton>
              {/* <AIInputModelSelect value={model} onValueChange={setModel}>
                <AIInputModelSelectTrigger>
                  <AIInputModelSelectValue />
                </AIInputModelSelectTrigger>
                <AIInputModelSelectContent>
                  {models.map((model) => (
                    <AIInputModelSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </AIInputModelSelectItem>
                  ))}
                </AIInputModelSelectContent>
              </AIInputModelSelect> */}
            </AIInputTools>
            <AIInputSubmit disabled={isSubmitting}>
              <SendIcon size={16} />
            </AIInputSubmit>
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};
