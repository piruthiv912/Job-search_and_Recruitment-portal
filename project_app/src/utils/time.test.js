import { formatRelativeTime } from './time';

describe('formatRelativeTime', () => {
  test('returns just now for recent timestamps', () => {
    expect(formatRelativeTime(new Date())).toBe('just now');
  });

  test('returns minutes ago for older timestamps', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
  });

  test('returns empty string for invalid values', () => {
    expect(formatRelativeTime(null)).toBe('');
    expect(formatRelativeTime('not-a-date')).toBe('');
  });
});
