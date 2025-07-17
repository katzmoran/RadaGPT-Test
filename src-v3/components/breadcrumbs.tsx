"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Edit2 } from "lucide-react";
import { useSelectedLayoutSegments } from "next/navigation";
import React from "react";

export default function Breadcrumbs() {
  const segments = useSelectedLayoutSegments()
    // Filter out any segments that start with an underscore (due to Next.js Parallel Routing)
    .filter((s) => !s.startsWith("_"))
    // Split the segments by "-" and capitalize the first letter of each word
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

  // if the page is a /chat/[id] page, then render an edit <Edit /> icon behind the breadcrumb page on hover.

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.length > 0 && (
          <BreadcrumbSeparator className="hidden md:block" />
        )}
        {segments.map((segment, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <BreadcrumbPage className="group/title flex items-center gap-2">
                  {segment}
                  {segments[0] === "Chat" && segments.length === 2 && (
                    <span className="opacity-0 group-hover/title:opacity-100 transition-opacity duration-300">
                      <Edit2 className="size-3" />
                    </span>
                  )}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  className="hidden md:block"
                  href={`/${segments
                    .slice(0, index + 1)
                    .join("/")
                    .toLocaleLowerCase()}`}
                >
                  {segment}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < segments.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
