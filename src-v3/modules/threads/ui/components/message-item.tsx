"use client";

import { Markdown } from "@/components/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AI_NAME,
  SHOW_AI_NAME_ON_RESPONSE,
  SHOW_COMPLETION_VOTING,
  SHOW_USER_NAME_ON_PROMPT,
} from "@/lib/config";
import { cn } from "@/lib/utils";
import SourcesButton from "@/modules/messages/ui/components/sources-button";
import { ThreadMessage } from "@azure/ai-agents";
import {
  Copy,
  Loader,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  UserIcon,
  Volume2,
} from "lucide-react";

export default function MessageItem(message: ThreadMessage) {
  const isUserMessage = message.role === "user";
  const hasCitations = false;

  const loading = false;

  const userImage = "..."; // TODO: Get user image from session
  const userName = "User"; // TODO: Get user name from session

  return (
    <div
      className={cn(
        "flex group",
        isUserMessage ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "inline-block max-w-3/4 shadow-none border-none",
          isUserMessage
            ? "ml-auto justify-end bg-muted"
            : "mr-auto justify-start"
        )}
      >
        {(isUserMessage && SHOW_USER_NAME_ON_PROMPT) ||
        (!isUserMessage && SHOW_AI_NAME_ON_RESPONSE) ? (
          <CardHeader
            className={cn(
              "flex flex-row items-center gap-2 p-2",
              !isUserMessage && "text-green-600"
            )}
          >
            <Avatar className="size-6">
              <AvatarImage
                src={isUserMessage ? userImage || undefined : "/ai-icon.png"}
              />
              <AvatarFallback className="text-muted-foreground">
                {isUserMessage ? (
                  <UserIcon className="size-4" />
                ) : (
                  <Sparkles className="size-4" />
                )}
              </AvatarFallback>
            </Avatar>
            {isUserMessage ? userName || "You" : AI_NAME}
          </CardHeader>
        ) : null}
        <CardContent className="flex flex-col p-2 space-y-2">
          {loading ? (
            <div className="flex flex-row gap-2 items-center animate-pulse">
              <Loader className="animate-spin size-4" />
              <span className="text-muted-foreground">Thinking...</span>
            </div>
          ) : (
            <>
              <div>
                <Markdown>{JSON.stringify(message.content[0])}</Markdown>
              </div>
              {(!isUserMessage && hasCitations) ||
                (true && <SourcesButton citations={[]} />)}
              {/* TODO: supply citations as required */}
            </>
          )}
        </CardContent>
        {!isUserMessage && (
          <CardFooter className="flex flex-row items-center gap-1 p-0 text-muted-foreground h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="ghost" className="size-8">
              <Copy className="size-4" />
            </Button>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            {SHOW_COMPLETION_VOTING && (
              <>
                <Button variant="ghost" className="size-8">
                  <ThumbsUp className="size-4" />
                </Button>
                <Button variant="ghost" className="size-8">
                  <ThumbsDown className="size-4" />
                </Button>
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
              </>
            )}
            <Button variant="ghost" className="size-8">
              <Volume2 className="size-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
