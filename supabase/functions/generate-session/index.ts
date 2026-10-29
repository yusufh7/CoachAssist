import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createOpenAI } from "npm:@ai-sdk/openai@3";
import { streamText, Output, NoObjectGeneratedError } from "npm:ai@6";
import { z } from "npm:zod@3.25.76";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id.ts";

const MODEL = "openai/gpt-6-astra";
const ANON_LIMIT = 3;
const USER_LIMIT = 20;

const Body = z.object({
  teamName: z.string().min(1).max(100),
  ageGroup: z.enum(["u7", "u9", "u11", "u13", "u15", "u17", "adult"]),
  skillLevel: z.string().min(1).max(30),
  playerCount: z.coerce.number().int().min(1).max(40),
  sessionDuration: z.coerce.number().int().refine((n) => [45, 60, 75, 90, 120].includes(n)),
  playingStyle: z.string().max(40).optional().nullable(),
  sessionGoals: z.string().min(1).max(1000),
  currentFocus: z.string().max(1000).optional().nullable(),
  action: z.enum(['generate', 'adjust']).optional(),
  adjustment: z.enum(['Too easy', 'Too hard', 'Fewer players', 'More players', 'Players losing focus', 'Wet pitch / less space']).optional(),
  activity: z.object({ name: z.string().max(200), duration: z.number().int().min(1).max(120), description: z.string().max(3000), setup: z.string().max(3000), equipment: z.string().max(1000), coachingPoints: z.array(z.string().max(1000)).max(10), progressions: z.array(z.string().max(1000)).max(10), regressions: z.array(z.string().max(1000)).max(10) }).optional(),
});

const Activity = z.object({
  name: z.string(),
  duration: z.number(),
  description: z.string(),
  setup: z.string(),
  equipment: z.string(),
  coachingPoints: z.array(z.string()),
  progressions: z.array(z.string()),
  regressions: z.array(z.string()),
});
const PlanSchema = z.object({
  title: z.string(),
  objectives: z.array(z.string()),
  phases: z.array(z.object({ name: z.string(), duration: z.number(), activities: z.array(Activity) })),
});

const FORMAT: Record<string, string> = {
  u7: "5v5 or smaller (3v3, 4v4)", u9: "5v5 or 7v7", u11: "7v7 or 9v9",
  u13: "9v9 or 11v11", u15: "11v11", u17: "11v11", adult: "11v11",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "Invalid input", fields: parsed.error.flatten().fieldErrors }, 400);
  const t = parsed.data;
  const adjusting = t.action === 'adjust';
  if (adjusting && (!t.activity || !t.adjustment)) return json({ error: 'Choose a practice and adjustment.' }, 400);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "AI is not configured" }, 500);

  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return json({ error: 'Service unavailable' }, 500);
  const admin = createClient(url, serviceKey);

  // Who is calling? Signed-in users get a higher daily allowance.
  let userId: string | null = null;
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (token) {
    const { data } = await admin.auth.getUser(token);
    userId = data.user?.id ?? null;
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const ipHash = await sha256(`coachassist:${ip}`);
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const q = admin.from("ai_generation_log").select("id", { count: "exact", head: true }).gte("created_at", since);
  const { count, error: countErr } = userId ? await q.eq("user_id", userId) : await q.eq("ip_hash", ipHash).is("user_id", null);
  if (countErr) return json({ error: "Could not check usage" }, 500);
  const limit = userId ? USER_LIMIT : ANON_LIMIT;
  if ((count ?? 0) >= limit) {
    return json({
      error: userId
        ? `You've reached today's limit of ${limit} AI sessions. Try again tomorrow.`
        : `You've used your ${limit} free AI sessions today. Sign in for more.`,
      code: "rate_limited",
    }, 429);
  }

  const young = ["u7", "u9", "u11"].includes(t.ageGroup);
  const long = t.sessionDuration >= 75;
  const system = `You are CoachAssist, a friendly UK grassroots football coaching assistant. Write in UK English with UK football terms (pitch, boots, bibs, kit, "match", "1v1"). Practical, no fluff.
Design sessions in line with the FA's player-centred, game-based approach (the Four Corner Model: technical, physical, psychological, social) and the FA principles of play in and out of possession.
Rules:
- Phases in order: Warm-Up, Technical Practice, Tactical Practice, ${long ? "Small-Sided Game, " : ""}Cool-Down.
- Phase durations must add up to exactly ${t.sessionDuration} minutes; activity durations within a phase must add up to that phase's duration. Whole minutes only.
- Games should use ${FORMAT[t.ageGroup]} formats suitable for ${t.playerCount} players. Say how to split the group, including odd numbers.
- ${young ? "NO heading practices or deliberate heading for this age group (FA heading guidance)." : "Keep any heading practice minimal and in line with FA heading guidance."}
- Every activity: 3-5 short coaching points, 2-3 progressions, 2-3 regressions, realistic area size in yards, and grassroots-available equipment.
- Keep descriptions to 2-3 sentences. Do not invent statistics, endorsements or quotes.
${adjusting ? `Return ONLY one replacement activity for the supplied practice. Keep the same learning goal and EXACTLY ${t.activity?.duration} minutes. Apply the requested adjustment. Account for every player, including rotations. Do not generate other practices.` : ''}`;

  const prompt = `Team: ${t.teamName}
Age group: ${t.ageGroup.toUpperCase()}
Ability: ${t.skillLevel}
Players: ${t.playerCount}
Session length: ${t.sessionDuration} minutes
Playing style: ${t.playingStyle || "no preference"}
Session goals: ${t.sessionGoals}
Current focus / notes: ${t.currentFocus || "none"}
${adjusting ? `Adjustment: ${t.adjustment}\nOriginal practice: ${JSON.stringify(t.activity)}` : ''}`;

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  try {
    const result = streamText({
      model: provider.responses(MODEL),
      system,
      prompt,
      output: Output.object({ schema: adjusting ? Activity : PlanSchema }),
      abortSignal: req.signal,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const plan = await result.output;
    if (adjusting) {
      const checked = Activity.safeParse(plan);
      if (!checked.success || !t.activity) return json({ error: 'The adjusted practice was unusable. Your original is unchanged.' }, 502);
      if (young && /\bhead(er|ers|ing|ed)?\b/i.test(JSON.stringify(checked.data))) return json({ error: 'The adjusted practice did not meet age safety rules. Your original is unchanged.' }, 502);
      await admin.from('ai_generation_log').insert({ user_id: userId, ip_hash: ipHash });
      return json({ activity: { ...checked.data, duration: t.activity.duration } });
    }
    await admin.from("ai_generation_log").insert({ user_id: userId, ip_hash: ipHash });
    return json({ plan, remaining: Math.max(0, limit - (count ?? 0) - 1) });
  } catch (err: any) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    if (NoObjectGeneratedError.isInstance(err)) return json({ error: "The AI returned an unusable plan" }, 502);
    const status = Number(err?.statusCode) || 500;
    console.error("generate-session failed", status, err?.message);
    if (status === 402) return json({ error: "AI credits have run out", code: "credits" }, 402);
    if (status === 429) return json({ error: "AI is busy right now, please try again shortly", code: "busy" }, 429);
    if (status === 403) return json({ error: err?.message || "AI access denied" }, 403);
    return json({ error: "AI generation failed" }, 502);
  }
});
