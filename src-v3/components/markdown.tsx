import { USE_ALT_AS_CAPTION } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { memo, ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "./code-block";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const components: Partial<Components> = {
  code: CodeBlock,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p: (paragraph: { children?: ReactNode; node?: any }) => {
    const { node } = paragraph;

    if (node.children[0].tagName === "img") {
      const image = node.children[0];
      const metastring = image.properties.alt;
      const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
      const metaWidth = metastring.match(/{([^}]+)x/);
      const metaHeight = metastring.match(/x([^}]+)}/);
      const width = metaWidth ? metaWidth[1] : "768";
      const height = metaHeight ? metaHeight[1] : "432";
      const isPriority = metastring?.toLowerCase().match("{priority}");
      const hasCaption = metastring?.toLowerCase().includes("{caption:");
      const caption = metastring?.match(/{caption: (.*?)}/)?.pop();

      return (
        <figure className="max-w-lg">
          <Image
            src={image.properties.src || "/placeholder.jpg"}
            width={width}
            height={height}
            className="h-auto max-w-full rounded-md"
            alt={alt || (USE_ALT_AS_CAPTION ? caption || alt : "Image in Chat")}
            priority={isPriority}
          />
          {(hasCaption || (alt && USE_ALT_AS_CAPTION)) && (
            <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
              {caption || (USE_ALT_AS_CAPTION ? alt : null)}
            </figcaption>
          )}
        </figure>
      );
    }

    return <>{paragraph.children}</>;
  },
  hr: () => {
    return <Separator className="my-8" />;
  },
  blockquote: ({ children }) => {
    return (
      <blockquote className="border-l-4 border-zinc-500 dark:border-zinc-400 pl-4 py-1 my-2">
        {children}
      </blockquote>
    );
  },
  kbd: ({ children }) => {
    // <kbd className="bg-zinc-100 dark:bg-zinc-800 text-sm px-1 rounded-md">
    //   {children}
    // </kbd>
    return (
      <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
        {children}
      </kbd>
    );
  },
  table: ({ children }) => {
    return <Table className="my-2">{children}</Table>;
  },
  tr: ({ children }) => {
    return <TableRow>{children}</TableRow>;
  },
  td: ({ children }) => {
    return (
      <TableCell className="border rounded-md border-gray-200 dark:border-gray-500 p-2">
        {children}
      </TableCell>
    );
  },
  th: ({ children }) => {
    return (
      <TableHead className="border border-gray-200 dark:border-gray-500 p-2 font-semibold bg-gray-100 dark:bg-muted">
        {children}
      </TableHead>
    );
  },
  tbody: ({ children }) => {
    return (
      <TableBody className="divide-y divide-gray-200 dark:divide-gray-500">
        {children}
      </TableBody>
    );
  },
  thead: ({ children }) => {
    return (
      <TableHeader className="divide-y divide-gray-200 dark:divide-gray-500">
        {children}
      </TableHeader>
    );
  },
  tfoot: ({ children }) => {
    return (
      <TableFooter className="divide-y divide-gray-200 dark:divide-gray-500">
        {children}
      </TableFooter>
    );
  },
  ol: ({ children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ children, ...props }) => {
    const href = props.href;

    if (!href) return <>{children}</>;

    return (
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        href={href}
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
};

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
