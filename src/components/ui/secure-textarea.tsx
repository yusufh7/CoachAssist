import * as React from "react";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";
import { sanitizeInput } from "@/lib/validation";

interface SecureTextareaProps extends React.ComponentProps<"textarea"> {
  maxLength?: number;
  sanitize?: boolean;
}

const SecureTextarea = React.forwardRef<HTMLTextAreaElement, SecureTextareaProps>(
  ({ className, onChange, maxLength = 500, sanitize = true, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let value = e.target.value;
      
      // Apply character limit
      if (maxLength && value.length > maxLength) {
        value = value.slice(0, maxLength);
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
      
      onChange?.(sanitizedEvent as React.ChangeEvent<HTMLTextAreaElement>);
    };

    return (
      <Textarea
        {...props}
        ref={ref}
        className={cn(className)}
        onChange={handleChange}
        maxLength={maxLength}
      />
    );
  }
);

SecureTextarea.displayName = "SecureTextarea";

export { SecureTextarea };