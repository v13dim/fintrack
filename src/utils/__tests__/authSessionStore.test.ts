import { getSession, setSession } from '../authSessionStore';

describe('authSessionStore', () => {
  beforeEach(() => {
    setSession(false);
  });

  it('should return false by default', () => {
    expect(getSession()).toBe(false);
  });

  it('should return true after setSession(true)', () => {
    setSession(true);
    expect(getSession()).toBe(true);
  });

  it('should return false after setSession(false)', () => {
    setSession(true);
    setSession(false);
    expect(getSession()).toBe(false);
  });
});
