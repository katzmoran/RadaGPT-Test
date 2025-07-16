import { agentClient } from "@/lib/ai-foundry";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Agent } from "@azure/ai-agents";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

/**
 * Get all connected agents from the thread metadata.
 * @param metadata - The thread metadata containing connected agents (asst_*).
 * @returns An array of connected agents with their IDs and thread IDs.
 */
function getConnectedAgentIds(metadata: Record<string, any> | null) {
  return Object.entries(metadata || {})
    .filter(([key]) => key.startsWith("connected_agent|"))
    .map(([key, value]) => ({
      agentId: key.split("|")[1],
      threadId: value,
    }));
}

export const agentRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        modelDeploymentName: z.string(),
        name: z.string(),
        description: z.string().max(100).optional(),
        temperature: z.number().min(0).max(1).optional(),
        topP: z.number().min(0).max(1).optional(),
        instructions: z.string().max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Destructure the input
      const { modelDeploymentName, name, description, temperature, topP, instructions } = input;

      // Create a new Azure AI Foundry Agent thread
      const thread = await agentClient.createAgent(
        modelDeploymentName, {
        name,
        description,
        temperature,
        topP,
        instructions,
        // TODO: Tool params etc...
      });

      console.debug("Created agent, agent ID:", thread.id);

      return thread;
    }),

  getMany: baseProcedure
    .input(
      z.object({
        // TODO: Pagination and filtering
      }),
    )
    .query(async ({ ctx, input }) => {
      // Retrieve agents from Azure AI Foundry
      const agentsIterator = agentClient.listAgents();
      const agents = [];
      for await (const agent of agentsIterator) {
        console.debug("Agent ID:", agent.id);
        agents.push(agent);
      }

      return agents;
    }),

  getById: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      // Retrieve the agent from Azure AI Foundry
      const agent = await agentClient.getAgent(id);
      console.debug("Retrieved agent:", agent);

      return agent;
    }),

  getThreadConnectedAgents: baseProcedure
    .input(
      z.object({
        threadId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { threadId } = input;
      // Retrieve the agent thread by ID
      const thread = await agentClient.threads.get(threadId);

      if (!thread) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Agent thread with ID ${threadId} not found`,
        });
      }

      // Get the ids of the connected agents
      const connectedAgents = getConnectedAgentIds(thread.metadata);

      const agents: Agent[] = [];
      for (const { agentId } of connectedAgents) {
        // Retrieve each connected agent by ID
        const agent = await agentClient.getAgent(agentId);
        if (agent) {
          agents.push({
            ...agent,
          });
        } else {
          console.warn(`Agent with ID ${agentId} not found`);
        }
      }

      console.debug("Connected agents:", agents);

      return agents;
    }),

  delete: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // Delete the agent from Azure AI Foundry
      const status = await agentClient.deleteAgent(id);
      console.debug("Deleted agent:", id);

      return { success: status.deleted };
    })
});