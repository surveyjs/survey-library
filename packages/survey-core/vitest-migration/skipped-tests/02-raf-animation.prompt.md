---
description: "Un-skip survey-core tests that depend on requestAnimationFrame loops or CSS-driven animation timing."
name: "Un-skip RAF / animation-timer tests"
agent: "agent"
---
Un-skip the survey-core tests listed below. All of them fail under jsdom because either:
- they call into a `waitRender` / `requestAnimationFrame`-based loop that never advances, or
- they depend on a CSS animation `transitionend` / `animationend` event that jsdom does not emit, or
- they depend on `getComputedStyle` returning real layout dimensions for an element mid-animation.

## Working directory

```
cd packages/survey-core
```

## In-scope tests

### `tests/question_imagemap_tests.ts`
| Line | Test |
|---|---|
| 157 | `Check init` |
| 189 | `Check svg render` |
| 463 | `visibleIf render` |
| 605 | `Locale change test` |
| 708 | `control points in design mode` (already `async`) |

All five hang on `waitRender()` / RAF loops.

### `tests/question_paneldynamic_tests.ts`
| Line | Test |
|---|---|
| 7254 | `paneldynamic: check panelsAnimation options` |

### `tests/question_matrixdynamictests.ts`
| Line | Test | Marker |
|---|---|---|
| 8488 | `table: check animation options` | `// VITEST-MIGRATION: MANUAL -- TIMER` (the `getEnterOptions().cssClass` path reports `0px` instead of `20px`) |

### `tests/question_ratingtests.ts`
| Line | Test |
|---|---|
| 1686 | `check rating triggerResponsiveness method` (depends on `offsetWidth` reporting non-zero — overlap with [01-jsdom-layout.prompt.md](01-jsdom-layout.prompt.md); resolve here if `vi.useFakeTimers()` alone fixes it, otherwise punt to that prompt) |

## Resolution recipes

### A. Synchronous `requestAnimationFrame` shim

Replace jsdom's RAF (which queues to a real timer) with an immediate one for the test:

```ts
let rafCallbacks: FrameRequestCallback[] = [];
const originalRAF = window.requestAnimationFrame;
const originalCAF = window.cancelAnimationFrame;
beforeEach(() => {
  rafCallbacks = [];
  window.requestAnimationFrame = (cb) => { rafCallbacks.push(cb); return rafCallbacks.length; };
  window.cancelAnimationFrame = (id) => { rafCallbacks[id - 1] = () => {}; };
});
afterEach(() => {
  window.requestAnimationFrame = originalRAF;
  window.cancelAnimationFrame = originalCAF;
});
function flushRAF(times = 5) {
  for (let i = 0; i < times; i++) {
    const cbs = rafCallbacks;
    rafCallbacks = [];
    cbs.forEach(cb => cb(performance.now()));
  }
}
```

After triggering the action under test, call `flushRAF()` until the assertion holds (or up to a fixed cap to avoid infinite loops in case of regression).

If many tests in the same file need this, lift the shim into a `describe`-level `beforeEach` rather than per-test.

### B. Force-fire `transitionend` / `animationend`

The codebase listens for both events on rendered elements during enter/leave animations. Fire them manually after the action under test:

```ts
const evt = new Event("animationend", { bubbles: true });
(animatedEl as HTMLElement).dispatchEvent(evt);
```

The setup file (`tests/vitest.setup.ts`) already polyfills `AnimationEvent`; reuse that constructor if the listener checks `instanceof AnimationEvent`.

### C. Fake timers

For tests that use `setTimeout` / `setInterval` (e.g., `triggerResponsiveness`):

```ts
import { vi } from "vitest";
beforeEach(() => vi.useFakeTimers({ toFake: ["setTimeout", "setInterval", "queueMicrotask"] }));
afterEach(() => vi.useRealTimers());
// ...
vi.advanceTimersByTime(100);
```

Avoid `toFake: ["requestAnimationFrame"]` — it conflicts with shim **A**.

### D. Move to a Playwright spec

For `paneldynamic: check panelsAnimation options`, `table: check animation options`, and any imagemap test where the production code path is unreachable without real layout, port the test to `packages/survey-react-ui/e2e/` (or the matching UI package). Leave a one-line breadcrumb in the survey-core file pointing at the new location and delete the skipped test.

## Required output

1. Per-test result table:

   | File | Line | Test | Recipe used (A/B/C/D) | Vitest result |
   |---|---|---|---|---|

2. Diff of every modified test file.
3. `npx vitest run tests/<file>.ts` output for each touched file.
4. `npm run test` regression check from `packages/survey-core`.

## Quality checks

- Confirm shimmed RAF does not leak into other tests (assert `window.requestAnimationFrame === originalRAF` in `afterEach`).
- Combining recipe A with fake timers usually breaks one of them — pick one per test.
- Do not introduce arbitrary `await new Promise(r => setTimeout(r, N))` waits; assertions must be deterministic.
- Delete the `// Skipped: …` marker after un-skipping.
