export function hasDeliberateHeading(value: unknown): boolean {
  const text = JSON.stringify(value).replace(/\b(no|avoid|without|never|do not|don't)\s+(deliberate\s+)?heading\b/gi, '');
  return /\b(heading|headers?|headed)\b|\bhead\s+(the\s+)?ball\b/i.test(text);
}
export const SAFEGUARDING = 'Guidance only. Coaches are responsible for player safety, supervision and following their governing body’s rules. Adapt every practice to your players and conditions.';