"use client";

import { Cog, LogOut, Palette, ShieldAlert, UserIcon } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function UserDropdown() {
  const user = {
    name: "Guest User",
    email: "guest@example.com",
    image: null,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center space-x-4">
        <Avatar className="hover:opacity-75">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>
            <UserIcon className="size-6 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
        // side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || "Profile Picture"}
              />
              <AvatarFallback>
                <UserIcon className="size-6 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user?.name}</span>
              <span className="truncate text-xs">{user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex flex-row gap-2 items-center font-normal space-y-2 text-fuchsia-950 dark:text-red-400">
          <ShieldAlert className="size-4" />
          You are an Admin
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal space-y-2">
          <span className="flex gap-2 items-center">
            <Palette className="size-4" />
            Theme
          </span>
          <ThemeToggle />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/settings"}>
              <Cog className="size-4" />
              Admin Console
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem /*onClick={() => signOut({ redirectTo: "/" })} */>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
