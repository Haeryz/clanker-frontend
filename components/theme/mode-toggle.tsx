"use client";

import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options = [
  { label: "Light", value: "light", icon: SunIcon },
  { label: "Dark", value: "dark", icon: MoonIcon },
  { label: "System", value: "system", icon: MonitorIcon },
] as const;

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const currentTheme = theme ?? resolvedTheme ?? "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl border border-border/60 bg-background/40 text-foreground/70 transition hover:bg-background/70"
        >
          <SunIcon className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-44 rounded-xl border border-border/60 bg-popover/90 p-1 backdrop-blur"
      >
        {options.map(({ label, value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground/80 focus:bg-accent/40"
            onClick={() => setTheme(value)}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{label}</span>
            {currentTheme === value ? (
              <span className="text-xs font-medium uppercase tracking-wide text-primary">
                Active
              </span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
