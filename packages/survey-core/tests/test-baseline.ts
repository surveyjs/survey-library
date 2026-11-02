import { FunctionFactory } from "../src/functionsfactory";
import { settings } from "../src/settings";

// The setup file runs again for each test file even without isolation, while this module
// is evaluated once per worker. What it captures stays clean and what it holds survives
// from file to file.

export const coreFunctionNames: Array<string> = FunctionFactory.Instance.getAll();

// One registry per worker: src/utils/reduced-motion.ts keeps the media entry it got first,
// and __setMatchMedia has to reach that entry from every later file.
export const mediaQueries: Map<string, { matches: boolean, listeners: Set<(e: any) => void> }> = new Map();

function isPlain(v: any): boolean {
  return !!v && typeof v === "object" && (Array.isArray(v) || Object.getPrototypeOf(v) === Object.prototype);
}
function copy(v: any): any {
  if (Array.isArray(v)) return v.map(copy);
  if (isPlain(v)) {
    const res: any = {};
    Object.keys(v).forEach(k => { res[k] = copy(v[k]); });
    return res;
  }
  return v;
}
function restore(target: any, baseline: any): void {
  Object.keys(target).forEach(k => { if (!(k in baseline)) delete target[k]; });
  Object.keys(baseline).forEach(k => {
    const b = baseline[k];
    if (isPlain(b) && !Array.isArray(b) && isPlain(target[k]) && !Array.isArray(target[k])) restore(target[k], b);
    else target[k] = copy(b);
  });
}
const baseline: any = {};
Object.keys(settings).forEach(k => { if (k !== "environment") baseline[k] = copy((settings as any)[k]); });
// environment stays out: the setup file re-anchors it to the live document.
export function restoreSettings(): void {
  const env = (settings as any).environment;
  restore(settings, baseline);
  (settings as any).environment = env;
}
