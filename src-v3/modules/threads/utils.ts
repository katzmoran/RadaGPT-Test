import { AgentThread } from "@azure/ai-agents";

export const isBookmarked = (thread: AgentThread): boolean => {
  return thread.metadata?.isBookmarked === "true";
};