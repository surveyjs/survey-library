import { ILintFix } from "./types";

// The four shapes a repair takes, one function each: a rule states what it wants done and to
// which path, and never spells the edit list out. Every value a fix writes is something the
// linter composed - a name, a type, an allowed value, a rewritten string - so nothing to write
// is no repair at all, and setFix answers undefined for it. A rule can pass that answer straight
// to report(), which leaves a finding without a fix.

export function setFix(reason: string, path: string, value: any): ILintFix | undefined {
  if (value === undefined || value === "") return undefined;
  return { reason: reason, edits: [{ op: "set", path: path, value: value }] };
}

export function removeFix(reason: string, path: string): ILintFix {
  return { reason: reason, edits: [{ op: "remove", path: path }] };
}

export function renameFix(reason: string, path: string, key: string): ILintFix | undefined {
  if (!key) return undefined;
  return { reason: reason, edits: [{ op: "rename", path: path, key: key }] };
}

export function wrapFix(reason: string, path: string): ILintFix {
  return { reason: reason, edits: [{ op: "wrap", path: path }] };
}
