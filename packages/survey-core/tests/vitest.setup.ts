// Setup file for Vitest. Mirrors the side-effect imports and global settings
// from the Karma+QUnit entry barrel at tests/entries/test.ts.
import { afterEach, expect } from "vitest";
import "../src/localization/russian";
import "../src/localization/french";
import "../src/localization/finnish";
import "../src/localization/german";
import { settings } from "../src/settings";
import { ComponentCollection } from "../src/question_custom";
import { surveyLocalization } from "../src/surveyStrings";

settings.animationEnabled = false;
settings.dropdownSearchDelay = 0;

// ---------------------------------------------------------------------------
// Custom matchers that bridge QUnit semantics into Vitest.
// ---------------------------------------------------------------------------
// QUnit's `assert.equal(a, b)` uses `==` (loose equality), while Vitest's
// `expect(a).toBe(b)` uses `Object.is` (strict). The migration codemod maps
// `assert.equal` -> `expect().toLooseEqual()` so that legacy comparisons like
// `assert.equal(undefined, null)` or `assert.equal("0", 0)` keep their
// original semantics. New tests should prefer `toBe`/`toEqual` directly.
expect.extend({
  toLooseEqual(received: unknown, expected: unknown) {
    // eslint-disable-next-line eqeqeq
    const pass = received == expected;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${this.utils.printReceived(received)} not to loosely equal ${this.utils.printExpected(expected)}`
          : `expected ${this.utils.printReceived(received)} to loosely equal ${this.utils.printExpected(expected)}`,
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any> {
    toLooseEqual(expected: unknown): T;
  }
  interface AsymmetricMatchersContaining {
    toLooseEqual(expected: unknown): unknown;
  }
}

// ---------------------------------------------------------------------------
// Generalizable singleton cleanup.
// ---------------------------------------------------------------------------
// QUnit tests historically called `ComponentCollection.Instance.clear()` (and
// similar resets) on the trailing line of every test that mutated a singleton.
// When an assertion failed before that line, the cleanup was skipped and the
// next test inherited the leaked state. QUnit hid this because it isolates
// per-module differently; Vitest runs all tests in a file sequentially in the
// same V8 isolate, so leaks propagate.
//
// To make conversion safe AND deterministic, this `afterEach` resets every
// known global singleton after every test, regardless of pass/fail. Tests no
// longer need to call `.clear()` themselves -- the codemod strips trailing
// `.clear()` lines for the same reason.
//
// To register a new singleton for cleanup, add a reset call below.
const __defaultLocale = surveyLocalization.defaultLocale;
afterEach(() => {
  // ComponentCollection: registered custom question types (including internal:true)
  ComponentCollection.Instance.clear(true);
  // surveyLocalization: tests sometimes flip the default locale
  surveyLocalization.defaultLocale = __defaultLocale;
  // settings: re-apply our test defaults in case a test mutated them
  settings.animationEnabled = false;
  settings.dropdownSearchDelay = 0;
});
