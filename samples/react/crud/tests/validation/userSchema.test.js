import { describe, expect, it } from 'vitest';
import { userSchema } from '../../src/validation/userSchema.js';

describe('userSchema', () => {
  it('rejects empty names', () => {
    expect(() => userSchema.parse({ name: '   ' })).toThrow();
  });

  it('trims and accepts valid names', () => {
    const result = userSchema.parse({ name: '  Ada  ' });
    expect(result.name).toBe('Ada');
  });
});
