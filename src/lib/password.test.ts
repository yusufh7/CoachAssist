import { expect, it } from 'vitest';
import { validPassword } from './password';
it('requires a matching repeated password', () => { expect(validPassword('Football1!', 'Football2!')).toBe(false); expect(validPassword('Football1!', 'Football1!')).toBe(true); });
it('requires eight characters, mixed case, a number and symbol', () => {
  for (const p of ['Fo1!', 'football1!', 'FOOTBALL1!', 'Football!!', 'Football11']) expect(validPassword(p, p)).toBe(false);
});