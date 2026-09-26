/**
 * Parse a race time such as "2:27:14", "15:09" or "9:00.36" to seconds.
 * Returns NaN for anything that isn't a time.
 */
export function timeToSeconds(time: string): number {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,2}))?$/);
  if (!m) return NaN;
  const [, a, b, c, frac] = m;
  const whole = c === undefined ? Number(a) * 60 + Number(b) : Number(a) * 3600 + Number(b) * 60 + Number(c);
  return whole + (frac ? Number(`0.${frac}`) : 0);
}
