"use client";

import {
  SHOW_CODEBLOCK_COPY_BUTTON,
  SHOW_CODEBLOCK_LINE_NUMBERS,
} from "@/lib/config";
import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface CodeBlockProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inline?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  className?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
}

export function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [mounted, setMounted] = useState(false);
  const [isIconChecked, setIsIconChecked] = useState(false);
  const { resolvedTheme: theme } = useTheme();

  // Get the the language from the className (eg. className: `language-javascript` => `javascript`)
  const match = /language-(\w+)/.exec(className || "");

  const handleCopyClick = () => {
    navigator.clipboard.writeText(children);
    setIsIconChecked(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsIconChecked(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isIconChecked]);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <Skeleton className="my-2 h-24 w-full rounded-md animate-pulse" />;
  }

  if (!inline && match) {
    return (
      <div className="relative group/codeblock">
        <SyntaxHighlighter
          language={match[1]}
          style={theme === "light" ? oneLight : atomDark}
          showLineNumbers={SHOW_CODEBLOCK_LINE_NUMBERS}
        >
          {children}
        </SyntaxHighlighter>
        {SHOW_CODEBLOCK_COPY_BUTTON && (
          <Button
            onClick={handleCopyClick}
            variant={"ghost"}
            className="absolute top-0 right-0 mt-2 mr-2 p-0 h-6 text-muted-foreground opacity-0 group-hover/codeblock:opacity-100 transition-opacity duration-300"
          >
            {isIconChecked ? (
              <>
                <Check className="size-3 text-emerald-600" /> Done
              </>
            ) : (
              <>
                <Copy className="size-3" /> Copy
              </>
            )}
          </Button>
        )}
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
