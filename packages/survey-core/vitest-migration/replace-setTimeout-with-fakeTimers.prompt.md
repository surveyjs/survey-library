---
mode: agent
description: Replace real setTimeout-based async waits in survey-core unit tests with vi.useFakeTimers() / vi.advanceTimersByTime()
---

# Replace `setTimeout` with `vi.advanceTimersByTime` in survey-core tests

## Goal

Convert tests in `packages/survey-core/tests/**` that use real `setTimeout` (typically wrapped in a `new Promise(resolve => ...)` with a `__done`/`__remaining` counter) into deterministic, synchronous tests driven by Vitest fake timers (`vi.useFakeTimers()` + `vi.advanceTimersByTime(ms)`).

Real timers in these tests are slow, flaky on CI, and force the test to actually wait. Fake timers make the test:

- run instantly (no real wall-clock waiting),
- be deterministic (no race conditions between debounce/lazy-load callbacks),
- avoid the `__remaining`/`__done` Promise wrapper boilerplate.

## Reference (already converted) — copy this pattern

Two tests in [packages/survey-core/tests/questionDropdownTests.ts](packages/survey-core/tests/questionDropdownTests.ts) already follow the target pattern and must be used as the template:

- [questionDropdownTests.ts#L846](packages/survey-core/tests/questionDropdownTests.ts#L846) — `"The onGetChoiceDisplayValue callback fires multiple times, #6078"`
- [questionDropdownTests.ts#L1949](packages/survey-core/tests/questionDropdownTests.ts#L1949) — `"Rapidly Changing Search Filter"`

Target shape:

```ts
test("...", () => {
  vi.useFakeTimers();
  try {
    // ... arrange ...
    // act that schedules setTimeout/debounce/lazy-load callbacks
    vi.advanceTimersByTime(<exact delay>);
    // assertions immediately after each advance
    // ... more advances + assertions ...
  } finally {
    vi.useRealTimers();
  }
});
```

Key rules when converting:

1. The test becomes **synchronous** — drop the `new Promise(resolve => { ... })` wrapper and the `__remaining` / `__done` counter scaffolding.
2. Call `vi.useFakeTimers()` at the very start of the test body and `vi.useRealTimers()` in a `finally` block so a failing assertion still restores real timers.
3. Replace each nested `setTimeout(cb, ms)` with `vi.advanceTimersByTime(ms)` immediately followed by the assertions that were inside `cb`.
4. Use the exact `ms` constant that the original `setTimeout` used (e.g. `callbackTimeOutDelta`, `onChoicesLazyLoadCallbackTimeOut`, `settings.notifications.lifetime + 2`). Do not round.
5. If the test mutates global state (`settings.dropdownSearchDelay`, `settings.notifications.lifetime`, `surveyTimerFunctions.setTimeout`, `window.requestAnimationFrame`, etc.), restore it inside the same `finally` block, **before** `vi.useRealTimers()` is called only if it doesn't depend on timers; otherwise after.
6. Do **not** convert tests that intentionally override `window.setTimeout` to make it synchronous (those already are synchronous). See the “Skip / do not convert” list below.
7. Do **not** touch the generated bundle file `packages/survey-core/tests/bundle/test.js`.
8. After conversion, run `npm run test` from `packages/survey-core` and make sure the converted tests still pass. Run a single converted test with `npx vitest run -t "<test name>"` while iterating.

## Files & tests to convert

For each entry below: the file is linked, the line is the location of the first `setTimeout` in the test body. Convert the **entire enclosing `test(...)` / `QUnit.test(...)` block**, not just the one line.

### High-priority (multiple nested `setTimeout` chains — biggest payoff)

- [packages/survey-core/tests/notifier_tests.ts#L81](packages/survey-core/tests/notifier_tests.ts#L81) — test `"message box visibility"` (4 nested setTimeouts driven by `settings.notifications.lifetime`).
- [packages/survey-core/tests/questionDropdownTests.ts#L812](packages/survey-core/tests/questionDropdownTests.ts#L812) — lazy-load + filter chain (4 nested setTimeouts, uses `settings.dropdownSearchDelay`, `onChoicesLazyLoadCallbackTimeOut`, `callbackTimeOutDelta`, `newValueDebouncedInputValue`).
- [packages/survey-core/tests/question_tagbox_tests.ts#L407](packages/survey-core/tests/question_tagbox_tests.ts#L407) — tagbox lazy-load chain (5 nested setTimeouts).
- [packages/survey-core/tests/components/popuptests.ts#L1860](packages/survey-core/tests/components/popuptests.ts#L1860) — popup animation chain (6 nested setTimeouts; note the surrounding test patches `window.queueMicrotask` to use `setTimeout(..., animationTimeOut)` — keep that patch but route through fake timers).
- [packages/survey-core/tests/surveytests.ts#L2379](packages/survey-core/tests/surveytests.ts#L2379) — completion / async chain.
- [packages/survey-core/tests/surveytests.ts#L2451](packages/survey-core/tests/surveytests.ts#L2451) — second completion / async chain.
- [packages/survey-core/tests/surveytests.ts#L14622](packages/survey-core/tests/surveytests.ts#L14622) — async value/expression chain.
- [packages/survey-core/tests/surveytests.ts#L15590](packages/survey-core/tests/surveytests.ts#L15590) — `afterRenderPage` scheduling test (uses `setTimeout(..., 1)`).
- [packages/survey-core/tests/surveytests.ts#L15648](packages/survey-core/tests/surveytests.ts#L15648) — nested async chain (3 setTimeouts).
- [packages/survey-core/tests/surveyShowPreviewTests.ts#L124](packages/survey-core/tests/surveyShowPreviewTests.ts#L124) — preview state chain (3 nested setTimeouts).
- [packages/survey-core/tests/utilstests.ts#L443](packages/survey-core/tests/utilstests.ts#L443) — animation utils chain (2 nested setTimeouts; preserve the `window.requestAnimationFrame = (cb) => setTimeout(cb)` patch and undo it in `finally`).
- [packages/survey-core/tests/utilstests.ts#L555](packages/survey-core/tests/utilstests.ts#L555) — `runGroupAnimation` chain (3 nested setTimeouts).
- [packages/survey-core/tests/utilstests.ts#L847](packages/survey-core/tests/utilstests.ts#L847) — animation chain (2 setTimeouts).

### Medium / single-`setTimeout` tests

- [packages/survey-core/tests/basetests.ts#L75](packages/survey-core/tests/basetests.ts#L75) — `"Add async event"` test, `setTimeout(..., 0)` and `setTimeout(..., 10)`.
- [packages/survey-core/tests/basetests.ts#L95](packages/survey-core/tests/basetests.ts#L95) — async event timing assertion.
- [packages/survey-core/tests/dragDropMatrixTests.ts#L168](packages/survey-core/tests/dragDropMatrixTests.ts#L168) — `setTimeout(..., 2000)` waiting for matrix drag prep — perfect candidate (saves 2s per run).
- [packages/survey-core/tests/question_expressiontests.ts#L398](packages/survey-core/tests/question_expressiontests.ts#L398) — async expression evaluation.
- [packages/survey-core/tests/question_expressiontests.ts#L417](packages/survey-core/tests/question_expressiontests.ts#L417) — async expression evaluation (second test).
- [packages/survey-core/tests/questionDropdownTests.ts#L688](packages/survey-core/tests/questionDropdownTests.ts#L688) — single-setTimeout lazy-load assertion.
- [packages/survey-core/tests/questionDropdownTests.ts#L1614](packages/survey-core/tests/questionDropdownTests.ts#L1614) — lazy-load assertion.
- [packages/survey-core/tests/questionDropdownTests.ts#L1674](packages/survey-core/tests/questionDropdownTests.ts#L1674) — lazy-load assertion.
- [packages/survey-core/tests/question_ratingtests.ts#L1770](packages/survey-core/tests/question_ratingtests.ts#L1770) — rating async assertion.
- [packages/survey-core/tests/questionFileTests.ts#L244](packages/survey-core/tests/questionFileTests.ts#L244) — file upload completion timer.
- [packages/survey-core/tests/questionFileTests.ts#L505](packages/survey-core/tests/questionFileTests.ts#L505) — file upload assertion.
- [packages/survey-core/tests/questionFileTests.ts#L534](packages/survey-core/tests/questionFileTests.ts#L534) — file upload chain (2 setTimeouts).
- [packages/survey-core/tests/questionFileTests.ts#L918](packages/survey-core/tests/questionFileTests.ts#L918) — file upload chain (2 setTimeouts).
- [packages/survey-core/tests/questionFileTests.ts#L1233](packages/survey-core/tests/questionFileTests.ts#L1233) — file upload chain (2 setTimeouts).
- [packages/survey-core/tests/questionFileTests.ts#L1281](packages/survey-core/tests/questionFileTests.ts#L1281) — file upload chain (2 setTimeouts).
- [packages/survey-core/tests/question_paneldynamic_tests.ts#L8309](packages/survey-core/tests/question_paneldynamic_tests.ts#L8309) — panel dynamic async assertion.
- [packages/survey-core/tests/surveyElementTests.ts#L439](packages/survey-core/tests/surveyElementTests.ts#L439) — survey element async assertion.
- [packages/survey-core/tests/question_tagbox_tests.ts#L329](packages/survey-core/tests/question_tagbox_tests.ts#L329) — single-setTimeout tagbox assertion.
- [packages/survey-core/tests/question_signaturepadtests.ts#L425](packages/survey-core/tests/question_signaturepadtests.ts#L425) — signature pad async assertion.
- [packages/survey-core/tests/question_signaturepadtests.ts#L513](packages/survey-core/tests/question_signaturepadtests.ts#L513) — signature pad async assertion.
- [packages/survey-core/tests/question_signaturepadtests.ts#L724](packages/survey-core/tests/question_signaturepadtests.ts#L724) — signature pad async assertion.
- [packages/survey-core/tests/utilstests.ts#L321](packages/survey-core/tests/utilstests.ts#L321) — single-setTimeout debounce assertion.

### Special case — uses `surveyTimerFunctions.setTimeout`

- [packages/survey-core/tests/surveytimertests.ts#L418](packages/survey-core/tests/surveytimertests.ts#L418) — Convert only if the test was not deliberately exercising `surveyTimerFunctions.setTimeout` (the file overrides that function at [surveytimertests.ts#L8](packages/survey-core/tests/surveytimertests.ts#L8) for the whole file, so the test is already synchronous via that override). **Inspect first**, and skip if removing real `setTimeout` would change semantics.

## Skip / do not convert

These intentionally make `setTimeout` synchronous or are not real test bodies:

- [packages/survey-core/tests/questionImagepicker.ts#L192](packages/survey-core/tests/questionImagepicker.ts#L192) — overrides `window.setTimeout = (f) => f()` for the whole test, then restores it. Already synchronous; do not change.
- [packages/survey-core/tests/components/popuptests.ts#L101](packages/survey-core/tests/components/popuptests.ts#L101) and surrounding lines (≈101–109) — same `window.setTimeout` override pattern; leave alone.
- [packages/survey-core/tests/question_imagemap_tests.ts#L8](packages/survey-core/tests/question_imagemap_tests.ts#L8) — comment about `setTimeout`, no real call.
- [packages/survey-core/tests/vitest.setup.ts#L360](packages/survey-core/tests/vitest.setup.ts#L360) — global `requestAnimationFrame` shim used by the whole suite. Do not touch.
- [packages/survey-core/tests/utilstests.ts#L403](packages/survey-core/tests/utilstests.ts#L403) and [packages/survey-core/tests/utilstests.ts#L517](packages/survey-core/tests/utilstests.ts#L517) — `window.requestAnimationFrame = (cb) => setTimeout(cb)` rAF patches. Keep them in the surrounding test, but if the test body itself uses `setTimeout` for assertions (see above), wrap it in `vi.useFakeTimers()` after the rAF patch is installed.
- `packages/survey-core/tests/bundle/test.js` — generated bundle, never edit.

## Step-by-step recipe (apply per test)

1. Open the file and locate the test enclosing the `setTimeout` line listed above.
2. If the test body is `() => new Promise<void>(resolve => { let __remaining = N; const __done = () => { if (--__remaining <= 0) resolve(); }; ... })`, rewrite the signature to a plain `() => { ... }`. Delete `__remaining`, `__done`, and every `done()`/`__done()` call (they were just resolving the Promise).
3. Wrap the body:
   ```ts
   vi.useFakeTimers();
   try {
     // body
   } finally {
     vi.useRealTimers();
   }
   ```
4. Walk the original `setTimeout(cb, ms)` chain top-down. For each one:
   - Delete the `setTimeout(() => { ... }, ms)` wrapper.
   - Insert `vi.advanceTimersByTime(ms);` at the same place.
   - Inline the callback's contents directly after that call, at the same indentation level (one level less than before).
5. If multiple sibling `setTimeout`s with different delays existed (e.g. one schedules, then a later one waits longer), advance the timer by the **incremental delta**, not the cumulative time, so that intermediate assertions observe the correct state.
6. Save the file, run `npx vitest run tests/<file>.ts` from `packages/survey-core` to verify, then run the focused test name with `-t`.
7. Move on to the next test. Do **not** batch-convert all files in one shot — convert one file, verify, commit-style logical group, then move on.

## Verification

Before considering the task done:

- `cd packages/survey-core && npm run test` passes.
- `cd packages/survey-core && npm run lint` passes.
- No new `setTimeout(` calls were introduced; converted tests use only `vi.advanceTimersByTime`.
- Tests that were skipped (Skip list above) are unchanged.
