import z from "zod";

export const upsertFeedbackSchema = z.object({
  messageId: z.string(),
  vote: z.enum(["positive", "negative"]),
  comment: z.string().optional(),
});