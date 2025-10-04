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
          "glass-chip h-9 w-9 rounded-xl text-foreground/70 transition hover:border-primary/40 hover:text-primary",
          className
        )}
        {...props}
      />
    );
  }
);

IconButton.displayName = "IconButton";
