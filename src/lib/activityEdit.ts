import type { Activity } from './sessionGenerator';

export function reconcileActivityLayout(previous: Activity, updated: Activity): Activity {
  if (updated.setup === previous.setup && updated.description === previous.description) return updated;
  const { diagram, area, allocation, format, ...withoutStaleLayout } = updated;
  return withoutStaleLayout;
}