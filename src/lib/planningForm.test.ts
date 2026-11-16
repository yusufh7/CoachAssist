import { describe, expect, it } from 'vitest';
import { EMPTY_PLANNING_FORM, formFromTeam, planningFormKey, restorePlanningForm } from './planningForm';

describe('Unfinished planning recovery', () => {
  it('preserves raw notes, spaces, equipment and saved-team choice across refresh', () => {
    const form = { ...EMPTY_PLANNING_FORM, teamName: "St Mary's & Friends", currentFocus: '  Keep this note ', equipment: ['Balls', 'Mini goals'] };
    expect(restorePlanningForm(JSON.stringify({ form, teamId: 'saved-team' }))).toEqual({ form, teamId: 'saved-team' });
  });
  it('keeps a library goal when choosing a saved team', () => {
    expect(formFromTeam({ teamName: 'U11s', sessionGoals: 'Old goal', playerCount: 10 }, 'Goalkeeper Footwork').sessionGoals).toBe('Goalkeeper Footwork');
  });
  it('uses a newly selected library goal without discarding other unfinished details', () => {
    const restored = restorePlanningForm(JSON.stringify({ form: { ...EMPTY_PLANNING_FORM, teamName: 'U10s' }, teamId: 'team' }), 'Passing');
    expect(restored.form.teamName).toBe('U10s');
    expect(restored.form.sessionGoals).toBe('Passing');
  });
  it('separates guest and account drafts and handles broken storage', () => {
    expect(planningFormKey('one')).not.toBe(planningFormKey('two'));
    expect(planningFormKey()).not.toBe(planningFormKey('one'));
    expect(restorePlanningForm('{bad').form).toEqual(EMPTY_PLANNING_FORM);
  });
});