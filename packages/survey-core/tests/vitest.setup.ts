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

// jsdom does not implement ResizeObserver, but survey-library's responsive
// logic constructs `new ResizeObserver(...)` during `afterRender`. Provide a
// no-op stub so tests that don't care about responsive behavior don't crash.
// Tests that DO care can still override `window.ResizeObserver` per-test.
if (typeof (globalThis as any).ResizeObserver === "undefined") {
  (globalThis as any).ResizeObserver = class {
    observe() { /* no-op */ }
    unobserve() { /* no-op */ }
    disconnect() { /* no-op */ }
  };
}

// jsdom does not implement AnimationEvent. Tests that dispatch
// `new AnimationEvent("animationend")` need a constructible event class.
// Map it to the standard Event so handlers can still receive a plain Event.
if (typeof (globalThis as any).AnimationEvent === "undefined") {
  (globalThis as any).AnimationEvent = class extends Event {
    constructor(type: string, init?: EventInit) { super(type, init); }
  };
}

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
  // Mirrors QUnit's `assert.deepEqual` for survey-library observable arrays.
  // `Base.createNewArray` overrides `push`/`pop`/`shift`/`unshift`/`splice` as
  // own enumerable function properties on the array. Vitest's `toEqual` walks
  // own enumerable string keys, so a plain `[1, 2]` literal never matches an
  // observable `[1, 2, push, pop, shift, unshift, splice]`. QUnit's
  // `deepEqual` happened to ignore them. `toEqualValues` strips function-typed
  // own properties recursively before delegating to Vitest's deep-equal.
  toEqualValues(received: unknown, expected: unknown) {
    // Compare arrays ignoring own non-index function-typed properties
    // (`push`/`pop`/`shift`/`unshift`/`splice` overrides on
    // `Base.createNewArray`-produced observable arrays). Falls back to
    // `this.equals` for everything else, which preserves Vitest's normal
    // diff output and handles cycles correctly.
    const arrayValuesEqual = (
      a: unknown,
      b: unknown,
      customTesters: unknown[]
    ): boolean | undefined => {
      const aIsArr = Array.isArray(a);
      const bIsArr = Array.isArray(b);
      if (!aIsArr && !bIsArr) return undefined;
      if (!aIsArr || !bIsArr) return false;
      if ((a as unknown[]).length !== (b as unknown[]).length) return false;
      for (let i = 0; i < (a as unknown[]).length; i++) {
        if (!this.equals((a as unknown[])[i], (b as unknown[])[i], customTesters as never)) {
          return false;
        }
      }
      return true;
    };
    const pass = this.equals(received, expected, [arrayValuesEqual] as never);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${this.utils.printReceived(received)} not to deeply equal ${this.utils.printExpected(expected)} (ignoring array function properties)`
          : `expected values to be deeply equal (ignoring array function properties):\n${this.utils.diff(expected, received) ?? ""}`,
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any> {
    toLooseEqual(expected: unknown): T;
    toEqualValues(expected: unknown): T;
  }
  interface AsymmetricMatchersContaining {
    toLooseEqual(expected: unknown): unknown;
    toEqualValues(expected: unknown): unknown;
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
