import { agentClient } from "@/lib/ai-foundry";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

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