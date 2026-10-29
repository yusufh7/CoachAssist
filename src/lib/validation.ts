import { z } from "zod";

/** Escape text for any context where it is injected as raw HTML (React already escapes JSX). */
export const escapeHtml = (input: unknown): string =>
  String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const optionalText = (max: number, label: string) =>
  z
    .string()
    .max(max, `${label} must be ${max} characters or fewer`)
    .optional()
    .transform((v) => (v ?? "").trim());

// Raw text is stored as typed; we only trim on submit.
export const teamSetupSchema = z.object({
  pitchSize: optionalText(100, 'Pitch size'),
  equipment: z.array(z.string()).max(12).optional().default(['Balls', 'Cones', 'Bibs']),
  coachCount: z.coerce.number().int().min(1).max(10).optional().default(1),
  units: z.enum(['metres', 'yards']).optional().default('metres'),
  teamName: z
    .string({ required_error: "Team name is required" })
    .trim()
    .min(1, "Team name is required")
    .max(100, "Team name must be 100 characters or fewer")
    .regex(/^[\p{L}\p{N}\s.'’&()/-]+$/u, "Use letters, numbers, spaces and . ' ’ - & ( ) / only"),

  ageGroup: z.enum(["u7", "u9", "u11", "u13", "u15", "u17", "adult"], {
    errorMap: () => ({ message: "Choose an age group" }),
  }),

  skillLevel: z.enum(["beginner", "developing", "intermediate", "advanced", "elite"], {
    errorMap: () => ({ message: "Choose a skill level" }),
  }),

  playerCount: z.coerce
    .number({ invalid_type_error: "Enter the number of players" })
    .int("Whole numbers only")
    .min(1, "At least 1 player")
    .max(50, "Maximum 50 players"),

  sessionDuration: z.enum(["45", "60", "75", "90", "120"], {
    errorMap: () => ({ message: "Choose a session length" }),
  }),

  playingStyle: z
    .union([z.enum(["possession", "counter", "pressing", "direct", "flexible"]), z.literal("")])
    .optional()
    .transform((v) => v || ""),

  sessionGoals: z
    .string({ required_error: "Session goals are required" })
    .trim()
    .min(1, "Session goals are required")
    .max(500, "Session goals must be 500 characters or fewer"),

  currentFocus: optionalText(500, "Current focus"),
});

export type TeamSetupFormData = z.infer<typeof teamSetupSchema>;

// Simple client-side throttle for repeated submissions.
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts = 5;
  private readonly timeWindow = 60000;

  canProceed(identifier: string): boolean {
    const now = Date.now();
    const recent = (this.attempts.get(identifier) || []).filter((t) => now - t < this.timeWindow);
    if (recent.length >= this.maxAttempts) return false;
    recent.push(now);
    this.attempts.set(identifier, recent);
    return true;
  }
}

export const formRateLimiter = new RateLimiter();
