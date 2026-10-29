export function deliberateHeading(value: unknown): boolean {
  const text = JSON.stringify(value).replace(/\b(no|avoid|without|never|do not|don't)\s+(deliberate\s+)?heading\b/gi, '');
  return /\b(heading|headers?|headed)\b|\bhead\s+(the\s+)?ball\b/i.test(text);
}
interface Practice { duration: number; format?: string; allocation?: { active: number; rotating: number; groups: number }; area?: { unit: string }; diagram?: { players: unknown[] } }
export function validateGeneratedPlan(plan: { phases: { duration: number; activities: Practice[] }[] }, duration: number, players: number, age: string, units: string): string[] {
  const errors: string[] = [];
  if (plan.phases.length < 4 || plan.phases.length > 6) errors.push('Use 4–6 phases');
  if (plan.phases.reduce((s, p) => s + p.duration, 0) !== duration) errors.push('Phase durations must equal session duration');
  const maxSide = age === 'u7' ? 5 : age === 'u9' ? 7 : age === 'u11' ? 9 : 11;
  for (const phase of plan.phases) {
    if (phase.activities.reduce((s, a) => s + a.duration, 0) !== phase.duration) errors.push('Activity durations must equal phase duration');
    for (const a of phase.activities) {
      if (!Number.isInteger(a.duration) || a.duration < 1) errors.push('Use positive whole minutes');
      const allocation = a.allocation;
      if (!allocation || allocation.active * allocation.groups + allocation.rotating !== players) errors.push('Allocation must account for every player');
      if (a.area?.unit !== units) errors.push('Use the selected units');
      if (!a.diagram || a.diagram.players.length !== allocation?.active) errors.push('Diagram must show active players for one group');
      for (const match of (a.format || '').matchAll(/(\d+)\s*v\s*(\d+)/gi)) if (Number(match[1]) > maxSide || Number(match[2]) > maxSide) errors.push('Format exceeds the age-group maximum');
    }
  }
  if (['u7', 'u9', 'u11'].includes(age) && deliberateHeading(plan)) errors.push('No deliberate heading for U11 and below');
  return [...new Set(errors)];
}