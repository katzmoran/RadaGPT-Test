import { agentRouter } from '@/modules/agents/server/prodedures';
import { messageRouter } from '@/modules/messages/prodedures';
import { threadRouter } from '@/modules/threads/server/prodedures';
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  threads: threadRouter,
  agents: agentRouter,
  messages: messageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;