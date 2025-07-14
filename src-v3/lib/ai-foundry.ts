import { AgentsClient } from "@azure/ai-agents";
import { DefaultAzureCredential } from "@azure/identity";

const projectEndpoint = process.env["PROJECT_ENDPOINT"]
if (!projectEndpoint) {
  throw new Error("PROJECT_ENDPOINT environment variable is not set.");
}

export const agentClient = new AgentsClient(projectEndpoint, new DefaultAzureCredential());