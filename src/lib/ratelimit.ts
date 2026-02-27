const requests = new Map<string, { count: number; windowStart: number }>();

export function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const entry = requests.get(key);
  if (!entry) {
    requests.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (now - entry.windowStart > windowMs) {
    requests.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}
