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


  upsertFeedback: baseProcedure
    .input(
      z.object({
        messageId: z.string(),
        vote: z.enum(["positive", "negative"]),
        comment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { messageId, vote, comment } = input;

      // Here you would typically save the feedback to a database or send it to an analytics service
      console.debug("Feedback received for message:", messageId, "Vote:", vote, "Comment:", comment);

      return { success: true };
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