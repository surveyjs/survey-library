---
description: "Convert one survey-core test file from QUnit to Vitest with partial-conversion fallback"
name: "Convert Survey-core Test File (with manual fallback)"
argument-hint: "Path to a test file under packages/survey-core/tests"
agent: "agent"
---
Migrate one survey-core unit test file from QUnit to Vitest. **Convert as much as possible automatically.** When a test cannot be safely converted, leave it commented out in place and record it in the manual follow-up registry — do not skip the entire file.

Scope constraints:
- Only convert files under `packages/survey-core/tests/`.
- Do not modify UI package tests.
- Do not change production logic in `packages/survey-core/src/`.

## Conversion rules (apply mechanically)

Use the mapping table from `vitest-migration/PLAN.md` §2. Summary:

| QUnit | Vitest |
|---|---|
| `export default QUnit.module("Name")` | wrap all tests in `describe("Name", () => { ... })`; remove default export |
| `QUnit.test(name, function(assert){...})` | `test(name, () => {...})` |
| `QUnit.test(name, async function(assert){...})` | `test(name, async () => {...})` |
| `QUnit.skip(name, fn)` | `test.skip(name, fn)` |
| `assert.equal(a, b, msg)` | `expect(a, msg).toBe(b)` (see EQUAL_LOOSE rule below) |
| `assert.strictEqual(a, b, msg)` | `expect(a, msg).toBe(b)` |
| `assert.notEqual(a, b, msg)` | `expect(a, msg).not.toBe(b)` |
| `assert.deepEqual(a, b, msg)` | `expect(a, msg).toEqual(b)` |
| `assert.notDeepEqual(a, b, msg)` | `expect(a, msg).not.toEqual(b)` |
| `assert.ok(x, msg)` | `expect(x, msg).toBeTruthy()` |
| `assert.notOk(x, msg)` | `expect(x, msg).toBeFalsy()` |
| `assert.throws(fn, /regex|string|ErrorClass/, msg)` | `expect(fn, msg).toThrow(...)` (see THROWS_SHAPE rule) |

Required imports at top of file:

```ts
import { describe, test, expect } from "vitest";
// add `beforeEach`, `afterEach`, `vi` only if used
```

Remove `import "qunit";` references and any unused imports.

## Partial-conversion fallback (mandatory)

A test **must be left commented out** instead of converted when any of the following applies. For each such test, add a row to `packages/survey-core/vitest-migration/MANUAL-FOLLOWUP.md`.

| Reason code | Trigger |
|---|---|
| `ASYNC_DONE` | Test uses `assert.async()` or `assert.async(N)` and the rewrite to `await new Promise(...)` is non-obvious (more than one `done()` call site, conditional `done()` inside callbacks, or `done()` invoked from setTimeout chains). |
| `THROWS_SHAPE` | `assert.throws` second argument is a non-trivial Error instance, function matcher, or regex over `.message` whose Vitest equivalent is ambiguous. |
| `EQUAL_LOOSE` | `assert.equal` arguments have visibly different runtime types (e.g., `survey.getValue(...)` returns string but the expected literal is a number). Do not silently switch to `toBe`. |
| `DOM_API` | Test references `IntersectionObserver`, `ResizeObserver`, `HTMLCanvasElement.getContext`, real layout sizes (`offsetWidth`, `getBoundingClientRect` non-zero values), or other APIs not reliably implemented by jsdom. |
| `TIMER` | Test depends on real `setTimeout`/`setInterval` timing where naive conversion would race. |
| `CROSS_FILE_STATE` | Test depends on global state set up by another file via `Serializer.addClass` etc., where Vitest's per-file isolation would break it. |
| `OTHER` | Anything else; explain. |

### How to comment out a test

Replace the original `QUnit.test(...)` call with this structure:

```ts
// VITEST-MIGRATION: MANUAL — <REASON_CODE>: <one-line explanation>
/*
QUnit.test("original name", function (assert) {
  // ...original body unchanged...
});
*/
```

Rules:
- Keep the original QUnit code verbatim inside the block comment so a developer can finish the conversion later with full context.
- Do **not** translate any assertions inside a commented-out test.
- Do **not** wrap commented tests in `test.skip` — they are not Vitest tests at all yet, and adding `test.skip` would still require a working translation of the surrounding scaffolding.
- One marker comment per commented test.

### Registry entry format (append to `MANUAL-FOLLOWUP.md`)

Add a row to the table:

```
| <next #> | tests/<file>.ts | "<original test name>" | <REASON_CODE> | 03-convert-file.prompt.md | open |
```

If the file has no existing entries, append at the bottom of the table (replace the `_none yet_` placeholder if it is still there).

## Barrel update (mandatory when at least one test was converted)

After converting the file:
1. Open `packages/survey-core/tests/entries/test.ts`.
2. Remove the `export * from "../<file>";` line for the converted file.
3. This stops Karma from trying to load a file that imports from `vitest`.

If the file still contains commented-out QUnit code only (i.e., zero tests were converted), do **not** remove the barrel line; instead, abort and report — this prompt requires partial conversion to make progress.

## Required output

1. A concise summary listing: total tests in file, tests converted, tests commented out (with reason codes).
2. The diff of the converted test file.
3. The diff of `MANUAL-FOLLOWUP.md` (rows added).
4. The diff of `tests/entries/test.ts` (line removed).
5. The exact command to run the converted file:
   ```
   cd packages/survey-core
   npx vitest run tests/<file>.ts
   ```
6. The result of running that command (or an explanation if the run was skipped).

## Quality checks

- Preserve test names verbatim — they appear in CI logs and bisecting depends on stable names.
- Preserve setup/teardown semantics (top-level `Serializer.addClass`, etc.).
- Keep imports minimal and explicit; do not add unused imports.
- Do not introduce new test utilities or helper files unless strictly required by a conversion.
- Flag any production-code change required to make a test pass; do not make the change in this prompt — record it in `MANUAL-FOLLOWUP.md` under reason `OTHER`.

## Stop conditions (report and halt)

- Vitest run of the converted file fails for reasons unrelated to commented-out tests.
- The file uses `QUnit.module(name, hooks => { ... })` with `hooks.beforeEach/afterEach` (currently none exist in survey-core, but if introduced, manual review is required).
- The file's top-level code performs irreversible side effects on shared state that would conflict with Vitest worker isolation.
