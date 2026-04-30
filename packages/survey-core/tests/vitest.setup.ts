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
import { _setIsTouch } from "../src/utils/devices";

settings.animationEnabled = false;
settings.dropdownSearchDelay = 0;

// jsdom exposes `ontouchstart` on window, which makes the device-detection
// heuristic in src/utils/devices.ts treat the test environment as a touch
// device by default. The legacy Karma/QUnit environment ran in a real desktop
// browser where `IsTouch` was false; mirror that here so behavior gated on
// `IsTouch` (e.g. `ListModel.focusFirstVisibleItem`) matches Karma. Tests
// that need touch behavior call `_setIsTouch(true)` explicitly and reset it
// in their own teardown.
_setIsTouch(false);

// jsdom does not implement matchMedia. SurveyJS responsive logic and popup
// displayMode use it. Provide a controllable registry.
if (typeof (globalThis as any).matchMedia === "undefined") {
  const __mqRegistry: Map<string, { matches: boolean, listeners: Set<(e: any) => void> }> = new Map();
  (globalThis as any).matchMedia = function (query: string) {
    let entry = __mqRegistry.get(query);
    if (!entry) {
      entry = { matches: false, listeners: new Set() };
      __mqRegistry.set(query, entry);
    }
    const captured = entry;
    return {
      get matches() { return captured.matches; },
      media: query,
      onchange: null,
      addListener(cb: (e: any) => void) { captured.listeners.add(cb); },
      removeListener(cb: (e: any) => void) { captured.listeners.delete(cb); },
      addEventListener(_t: string, cb: (e: any) => void) { captured.listeners.add(cb); },
      removeEventListener(_t: string, cb: (e: any) => void) { captured.listeners.delete(cb); },
      dispatchEvent() { return false; },
    };
  };
  (globalThis as any).__setMatchMedia = function (query: string, matches: boolean) {
    let entry = __mqRegistry.get(query);
    if (!entry) {
      entry = { matches, listeners: new Set() };
      __mqRegistry.set(query, entry);
      return;
    }
    if (entry.matches === matches) return;
    entry.matches = matches;
    entry.listeners.forEach((cb) => cb({ matches, media: query }));
  };
  if (typeof (globalThis as any).window !== "undefined") {
    (globalThis as any).window.matchMedia = (globalThis as any).matchMedia;
  }
}

// jsdom 25 does provide CSS.escape, but be defensive.
if (typeof (globalThis as any).CSS === "undefined") {
  (globalThis as any).CSS = { escape: (s: string) => String(s).replace(/[^\w-]/g, (c) => "\\" + c) };
} else if (typeof (globalThis as any).CSS.escape !== "function") {
  (globalThis as any).CSS.escape = (s: string) => String(s).replace(/[^\w-]/g, (c) => "\\" + c);
}

// jsdom's requestAnimationFrame uses setTimeout(cb, 16). Some SurveyJS code
// schedules rAF chains during synchronous test flow; Vitest tests that don't
// await time will miss the callback. Replace with a microtask-fast variant
// that still defers (so re-entrancy works) but resolves on next macrotask.
if (typeof (globalThis as any).requestAnimationFrame === "function") {
  const __origRAF = (globalThis as any).requestAnimationFrame;
  const __origCAF = (globalThis as any).cancelAnimationFrame;
  (globalThis as any).requestAnimationFrame = (cb: (t: number) => void) => {
    return setTimeout(() => cb(performance.now()), 0) as any;
  };
  (globalThis as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
  (globalThis as any).__restoreRAF = () => {
    (globalThis as any).requestAnimationFrame = __origRAF;
    (globalThis as any).cancelAnimationFrame = __origCAF;
  };
}

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

// jsdom does not implement HTMLCanvasElement.getContext (without the optional
// `canvas` npm package). signature_pad and rating-color logic both require a
// 2D context. Provide a minimal stub that returns no-op methods plus a
// settable `fillStyle` (rating-color logic reads back the normalized color).
// Tests that need real canvas rendering must run under Karma + real browser.
if (typeof (globalThis as any).HTMLCanvasElement !== "undefined") {
  const proto: any = (globalThis as any).HTMLCanvasElement.prototype;
  if (!proto.__sv_getContext_stubbed) {
    proto.getContext = function (type: string) {
      if (type !== "2d") return null;
      const ctx: any = {
        fillStyle: "#000000",
        strokeStyle: "#000000",
        lineWidth: 1,
        canvas: this,
        save() { /* no-op */ },
        restore() { /* no-op */ },
        scale() { /* no-op */ },
        translate() { /* no-op */ },
        rotate() { /* no-op */ },
        beginPath() { /* no-op */ },
        closePath() { /* no-op */ },
        moveTo() { /* no-op */ },
        lineTo() { /* no-op */ },
        bezierCurveTo() { /* no-op */ },
        quadraticCurveTo() { /* no-op */ },
        arc() { /* no-op */ },
        rect() { /* no-op */ },
        fill() { /* no-op */ },
        stroke() { /* no-op */ },
        fillRect() { /* no-op */ },
        strokeRect() { /* no-op */ },
        clearRect() { /* no-op */ },
        drawImage() { /* no-op */ },
        getImageData() { return { data: new Uint8ClampedArray(4) }; },
        putImageData() { /* no-op */ },
        createImageData() { return { data: new Uint8ClampedArray(4) }; },
        setTransform() { /* no-op */ },
        getTransform() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }; },
        measureText() { return { width: 0 }; },
      };
      return ctx;
    };
    proto.toDataURL = function (type?: string) {
      const t = typeof type === "string" && type.length > 0 ? type : "image/png";
      return `data:${t};base64,`;
    };
    proto.__sv_getContext_stubbed = true;
  }
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
