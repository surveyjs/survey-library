// Statistics of a sample list. Platform-neutral: no fs, no process.
export function sorted(values: ReadonlyArray<number>): Array<number> {
  return values.slice().sort((a: number, b: number) => a - b);
}

export function quantile(values: ReadonlyArray<number>, q: number): number {
  if (values.length === 0) return NaN;
  const s = sorted(values);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
}

export function median(values: ReadonlyArray<number>): number {
  return quantile(values, 0.5);
}

export function p75(values: ReadonlyArray<number>): number {
  return quantile(values, 0.75);
}

export function min(values: ReadonlyArray<number>): number {
  return values.length === 0 ? NaN : Math.min.apply(null, values as Array<number>);
}

export function max(values: ReadonlyArray<number>): number {
  return values.length === 0 ? NaN : Math.max.apply(null, values as Array<number>);
}

// The median absolute deviation from the median (not scaled to sigma).
export function mad(values: ReadonlyArray<number>): number {
  if (values.length === 0) return NaN;
  const m = median(values);
  return median(values.map((v: number) => Math.abs(v - m)));
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export interface Summary {
  median: number;
  min: number;
  max: number;
  mad: number;
  p75: number;
}

export function summarize(values: ReadonlyArray<number>): Summary {
  return { median: round2(median(values)), min: round2(min(values)), max: round2(max(values)), mad: round2(mad(values)), p75: round2(p75(values)) };
}
