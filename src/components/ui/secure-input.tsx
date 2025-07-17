import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { sanitizeInput } from "@/lib/validation";

interface SecureInputProps extends React.ComponentProps<"input"> {
  maxLength?: number;
  allowedPattern?: RegExp;
  sanitize?: boolean;
}

const SecureInput = React.forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, onChange, maxLength = 200, allowedPattern, sanitize = true, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Apply character limit
      if (maxLength && value.length > maxLength) {
        value = value.slice(0, maxLength);
      }
      
      // Apply pattern validation
      if (allowedPattern && !allowedPattern.test(value) && value !== "") {
        return; // Don't update if pattern doesn't match
      }
      
      // Sanitize input
      if (sanitize) {
        value = sanitizeInput(value);
      }
      
      // Create new event with sanitized value
      const sanitizedEvent = {
        ...e,
        target: {
          ...e.target,
          value
        }
      };
      
      onChange?.(sanitizedEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <Input
        {...props}
        ref={ref}
        className={cn(className)}
        onChange={handleChange}
        maxLength={maxLength}
      />
    );
  }
);

SecureInput.displayName = "SecureInput";

export { SecureInput };