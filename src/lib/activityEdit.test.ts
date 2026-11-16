import { expect, it } from 'vitest';
import { buildSessionPlan } from './sessionGenerator';
import { reconcileActivityLayout } from './activityEdit';

it('removes stale diagram and allocation after a manual layout change', () => {
  const previous = { ...buildSessionPlan({ sessionDuration: 60 }).phases[0].activities[0], diagram: { players: [], cones: [], balls: [], arrows: [] }, allocation: { active: 10, rotating: 0, groups: 2 }, area: { length: 15, width: 15, unit: 'metres' as const }, format: '5v5' };
  const updated = reconcileActivityLayout(previous, { ...previous, setup: 'One new grid' });
  expect(updated.diagram).toBeUndefined();
  expect(updated.allocation).toBeUndefined();
  expect(updated.area).toBeUndefined();
  expect(updated.format).toBeUndefined();
  expect(updated.setup).toBe('One new grid');
});
it('retains the layout when only the name changes', () => {
  const previous = { ...buildSessionPlan({ sessionDuration: 60 }).phases[0].activities[0], diagram: { players: [], cones: [], balls: [], arrows: [] } };
  expect(reconcileActivityLayout(previous, { ...previous, name: 'Renamed' }).diagram).toEqual(previous.diagram);
});