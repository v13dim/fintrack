import { intervalToSeconds } from '../intervalToSeconds';

describe('intervalToSeconds', () => {
  it('returns null for "never"', () => {
    expect(intervalToSeconds('never')).toBeNull();
  });

  it('returns seconds for numeric strings', () => {
    expect(intervalToSeconds('30')).toBe(30);
    expect(intervalToSeconds('60')).toBe(60);
    expect(intervalToSeconds('300')).toBe(300);
  });

  it('returns null for invalid values', () => {
    expect(intervalToSeconds('')).toBeNull();
    expect(intervalToSeconds('abc')).toBeNull();
    expect(intervalToSeconds('12.5')).toBe(12);
  });
});
