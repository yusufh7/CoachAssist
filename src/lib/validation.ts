import { z } from "zod";
import DOMPurify from "dompurify";

// Input sanitization utility
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  }).trim();
};

// Team setup form validation schema
export const teamSetupSchema = z.object({
  teamName: z
    .string()
    .min(1, "Team name is required")
    .max(100, "Team name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-&']+$/, "Team name contains invalid characters")
    .transform(sanitizeInput),
  
  ageGroup: z.enum(["u7", "u9", "u11", "u13", "u15", "u17", "adult"], {
    required_error: "Age group is required"
  }),
  
  skillLevel: z.enum(["beginner", "developing", "intermediate", "advanced", "elite"], {
    required_error: "Skill level is required"
  }),
  
  playerCount: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number()
        .min(1, "Must have at least 1 player")
        .max(50, "Maximum 50 players allowed")
    ),
  
  sessionDuration: z.enum(["45", "60", "75", "90", "120"], {
    required_error: "Session duration is required"
  }),
  
  playingStyle: z.enum([
    "possession", 
    "counter", 
    "pressing", 
    "direct", 
    "flexible"
  ]).optional(),
  
  sessionGoals: z
    .string()
    .min(1, "Session goals are required")
    .max(500, "Session goals must be less than 500 characters")
    .transform(sanitizeInput),
  
  currentFocus: z
    .string()
    .max(500, "Current focus must be less than 500 characters")
    .transform(sanitizeInput)
    .optional()
});

export type TeamSetupFormData = z.infer<typeof teamSetupSchema>;

// Rate limiting utility for form submissions
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts = 5;
  private readonly timeWindow = 60000; // 1 minute

  canProceed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Clean old attempts
    const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    return true;
  }
}

export const formRateLimiter = new RateLimiter();