import { describe, it, expect } from 'vitest';

import { replaceUrlParams } from '../../utils/api-utils';
import { isEmptyValue } from '../../utils/common-utils';

describe('isEmptyValue', () => {
  it.each(['', null, undefined])('returns true for %s', (value) => {
    expect(isEmptyValue(value)).toBe(true);
  });

  it.each([0, false, ' ', 'a', [], {}])('returns false for %s', (value) => {
    expect(isEmptyValue(value)).toBe(false);
  });
});

describe('replaceUrlParams', () => {
  it('fills every placeholder', () => {
    expect(replaceUrlParams('/cases/:id/files/:fileId', { id: 5, fileId: 'abc' })).toBe(
      '/cases/5/files/abc',
    );
  });

  it('leaves a URL without placeholders unchanged', () => {
    expect(replaceUrlParams('/cases', { id: 5 })).toBe('/cases');
  });

  it('throws when a placeholder has no param', () => {
    expect(() => replaceUrlParams('/cases/:id', {})).toThrow('Missing parameter: id');
  });
});
