"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Laptop2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface ModeToggleProps {
  variant?: "icon" | "tabs";
}

export function ThemeToggle({ variant = "tabs" }: ModeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button className="p-2" variant="ghost" disabled>
        <Laptop2 />
      </Button>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
        className="p-2"
        variant="ghost"
      >
        {resolvedTheme === "light" ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    );
  }

  return (
    <Tabs defaultValue={resolvedTheme}>
      <TabsList className="flex flex-1 w-full">
        <TabsTrigger
          value="light"
          onClick={() => setTheme("light")}
          className="flex-1"
          title="Light theme"
        >
          <Sun size={18} />
        </TabsTrigger>
        <TabsTrigger
          value="dark"
          onClick={() => setTheme("dark")}
          className="flex-1"
          title="Dark theme"
        >
          <Moon size={18} />
        </TabsTrigger>
        <TabsTrigger
          value="system"
          onClick={() => setTheme("system")}
          className="flex-1"
          title="System theme"
        >
          <Laptop2 size={18} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
