"use client";

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const IconButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(
  ({ className, size = "icon", variant = "ghost", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(
          "h-9 w-9 rounded-xl border border-border bg-background/40 text-foreground/60 transition hover:bg-background/70 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10",
          className
        )}
        {...props}
      />
    );
  }
);

IconButton.displayName = "IconButton";
