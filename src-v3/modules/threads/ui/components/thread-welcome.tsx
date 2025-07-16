import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AI_NAME } from "@/lib/config";
import { Agent } from "@azure/ai-agents";
import { MessagesSquareIcon } from "lucide-react";

interface ThreadWelcomeProps {
  agents?: Agent[];
}

export function ThreadWelcome({ agents }: ThreadWelcomeProps) {
  const hasAgents = agents && agents.length > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 space-y-4">
      <MessagesSquareIcon className="size-14 text-primary" />
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">What's on your mind?</h1>
        {hasAgents ? (
          <p>{AI_NAME} is collaborating with:</p>
        ) : (
          <p>I'll do my best to assist...</p>
        )}
      </div>
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {agents?.map((agent) => (
          <Tooltip key={agent.id}>
            <TooltipTrigger>
              <Avatar>
                <AvatarFallback>
                  {agent.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <span>{agent.name}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
