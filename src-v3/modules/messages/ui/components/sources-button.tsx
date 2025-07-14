"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SourceButtonProps {
  citations: any[]; // TODO: Type this properly
}

export default function SourcesButton({ citations }: SourceButtonProps) {
  if (!citations.length) return null;
  return (
    <Button variant="outline" className="w-fit">
      Sources
      <CitationStack
        citations={citations.map((c) => ({
          id: c.id,
          url: c.icon,
        }))}
        maxIcons={3}
      />
    </Button>
  );
}

const CitationStack = ({
  citations,
  maxIcons = 3,
  avatarSize = "size-6",
  spacing = "lg",
}: {
  citations: { id: string; url: string }[];
  maxIcons?: number;
  avatarSize?: string;
  spacing?: string;
}) => {
  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      {citations.slice(0, maxIcons).map((citation) => (
        <Avatar
          key={citation.id}
          className={`data-[size=${avatarSize}]:w-6 data-[size=${avatarSize}]:h-6 ${spacing}`}
        >
          <AvatarImage src={citation.url} alt={`Source ${citation.id}`} />
          <AvatarFallback>{citation.id}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
};
