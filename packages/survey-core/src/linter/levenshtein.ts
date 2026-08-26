export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = new Array<number>(b.length + 1);
  let curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }
  return prev[b.length];
}

// Returns the closest candidate within an adaptive edit-distance cutoff, or undefined.
// Ties are broken alphabetically; comparison is case-insensitive but the returned
// value keeps the candidate's original casing.
export function closestMatch(name: string, candidates: Array<string>): string | undefined {
  if (!name || !Array.isArray(candidates) || candidates.length === 0) return undefined;
  const target = name.toLowerCase();
  const maxDistance = Math.max(1, Math.min(2, Math.floor(target.length / 3)));
  let best: string = undefined;
  let bestDistance = maxDistance + 1;
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    if (!candidate) continue;
    const distance = levenshteinDistance(target, candidate.toLowerCase());
    if (distance < bestDistance || (distance === bestDistance && !!best && candidate.toLowerCase() < best.toLowerCase())) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return bestDistance <= maxDistance ? best : undefined;
}
