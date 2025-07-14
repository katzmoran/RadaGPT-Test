import { agentClient } from "@/lib/ai-foundry";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        threadId: z.string(),
        content: z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Destructure the input
      const { threadId, content } = input;

      // Create a new message
      const message = await agentClient.messages.create(threadId, "user", content); // TODO: Include attachments array
      console.debug("Created message, message ID:", message.id);

      return message;
    }),

  getByThread: baseProcedure
    .input(
      z.object({
        threadId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Retrieve messages by thread from Azure AI Foundry
      const messagesIterator = agentClient.messages.list(input.threadId);
      const messages = [];
      for await (const message of messagesIterator) {
        console.debug("Message ID:", message.id);
        messages.push(message);
      }

      return messages;
    }),
});