import { describe, it, expect } from 'vitest';
import validateLang from '@/lib/lang';

describe('validateLang', () => {
  it('returns "da" for "da"', () => {
    expect(validateLang('da')).toBe('da');
  });

  it('returns "en" for "en"', () => {
    expect(validateLang('en')).toBe('en');
  });

  it('is case-insensitive and normalizes to lower-case', () => {
    expect(validateLang('EN')).toBe('en');
    expect(validateLang('Da')).toBe('da');
  });

  it('falls back to "en" for unknown values', () => {
    expect(validateLang('fr')).toBe('en');
    expect(validateLang(null)).toBe('en');
    expect(validateLang(undefined)).toBe('en');
  });
});
