import { expect } from "vitest";
import { FunctionFactory, settings } from "survey-core";
import { applyFix, ILintFinding, lintSurvey } from "../../src/linter/index";

// The linter shares the application's settings object, so a test that customizes
// a setting must restore it: "npm run test:watch" runs with --no-isolate, where a
// leaked value would reach unrelated test files.
// Paths are dotted, e.g. "commentSuffix", "matrix.totalsSuffix", "expressionVariables.row".
export function withSettings(patch: { [path: string]: any }, fn: () => void): void {
  const paths = Object.keys(patch);
  const saved: Array<{ owner: any, key: string, value: any }> = [];
  paths.forEach(path => {
    const parts = path.split(".");
    let owner: any = settings;
    for (let i = 0; i < parts.length - 1; i++) owner = owner[parts[i]];
    const key = parts[parts.length - 1];
    saved.push({ owner: owner, key: key, value: owner[key] });
    owner[key] = patch[path];
  });
  try {
    fn();
  } finally {
    for (let i = saved.length - 1; i >= 0; i--) {
      saved[i].owner[saved[i].key] = saved[i].value;
    }
  }
}

export function withFunction(name: string, func: (params: any[]) => any, fn: () => void): void {
  const existed = FunctionFactory.Instance.hasFunction(name);
  FunctionFactory.Instance.register(name, func);
  try {
    fn();
  } finally {
    if (!existed) FunctionFactory.Instance.unregister(name);
  }
}

// Applies the repair a finding carries and asserts the defect is gone: the rule that reported it
// finds nothing in the repaired JSON. The repaired JSON comes back, for the assertions that look
// at what the edit actually wrote. A finding pinned by its reason rather than its rule passes a
// matcher of its own.
export function expectFixSettles(json: any, finding: ILintFinding,
  match?: (f: ILintFinding) => boolean): any {
  const accepts = match || ((f: ILintFinding) => f.ruleId === finding.ruleId);
  const fixed = applyFix(json, finding.fix);
  expect(lintSurvey(fixed).findings.filter(accepts)).toHaveLength(0);
  return fixed;
}
