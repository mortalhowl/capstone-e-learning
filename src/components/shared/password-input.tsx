"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends React.ComponentProps<"input"> {
  wrapperClassName?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, wrapperClassName, disabled, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn("relative flex items-center w-full", wrapperClassName)}>
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10 h-10 px-3.5 text-sm", className)}
        ref={ref}
        disabled={disabled}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute right-1 text-muted-foreground hover:text-foreground size-8 rounded-md"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
