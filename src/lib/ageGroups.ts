export const AGE_GROUPS = ['u7', 'u8', 'u9', 'u10', 'u11', 'u12', 'u13', 'u14', 'u15', 'u16', 'u17', 'u18', 'adult'] as const;
export type AgeGroup = typeof AGE_GROUPS[number];

export const ageLabel = (a: string) => a === 'adult' ? 'Adult' : `Under ${a.slice(1)}s`;
const years = (a: string) => a === 'adult' ? 99 : Number(a.slice(1)) || 11;

/** FA youth formats: 5v5 to U8, 7v7 to U10, 9v9 to U12, then 11v11. */
export function maxSide(a: string) {
  const n = years(a);
  return n <= 8 ? 5 : n <= 10 ? 7 : n <= 12 ? 9 : 11;
}
/** No deliberate heading in training for U12 and below. */
export const noHeadingAge = (a: string) => years(a) <= 12;
