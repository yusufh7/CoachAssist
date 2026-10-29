import { expect, it } from 'vitest';
import { hasDeliberateHeading } from './safety';
it('detects deliberate heading in names, setup and description', () => {
  expect(hasDeliberateHeading({ name: 'Heading drill' })).toBe(true);
  expect(hasDeliberateHeading({ setup: 'Head the ball in pairs' })).toBe(true);
  expect(hasDeliberateHeading({ description: 'Practise headers' })).toBe(true);
});
it('allows scanning and instructions prohibiting heading', () => {
  expect(hasDeliberateHeading({ setup: 'Head up, no deliberate heading' })).toBe(false);
});