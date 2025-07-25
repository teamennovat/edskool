import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  onKeyDown,
  ...props
}: React.ComponentProps<"input">) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow space key
    if (e.key === " ") {
      e.stopPropagation(); // Prevent any default handling
    }
    // Call the original onKeyDown handler if provided
    onKeyDown?.(e);
  };

  return (
    <input
      type={type}
      onKeyDown={handleKeyDown}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border focus-visible:border-primary",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-gray-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
