import { agentRouter } from '@/modules/agents/server/procedures';
import { messageRouter } from '@/modules/messages/server/procedures';
import { threadRouter } from '@/modules/threads/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  threads: threadRouter,
  agents: agentRouter,
  messages: messageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;