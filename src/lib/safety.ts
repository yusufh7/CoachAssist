export function hasDeliberateHeading(value: unknown): boolean {
  const text = JSON.stringify(value)
    .replace(/\b(no|avoid|avoiding|without|never|not|don't|nor|ban|banned|prohibit\w*)\b[^.;!?\n"]{0,60}?\b(heading|headers?)\b/gi, '')
    .replace(/\b(heading|headers?)\b[^.;!?\n"]{0,25}?\b(not allowed|banned|prohibited|forbidden|off limits)\b/gi, '');
  return /\b(heading|headers?|headed)\b|\bhead\s+(the\s+)?ball\b/i.test(text);
}
export const SAFEGUARDING = 'Guidance only. Coaches are responsible for player safety, supervision and following their governing body’s rules. Adapt every practice to your players and conditions.';