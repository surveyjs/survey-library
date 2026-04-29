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
| `assert.equal(a, b, msg)` | `expect(a, msg).toLooseEqual(b)` (custom matcher; preserves QUnit's `==` semantics — see "Custom matchers" below) |
| `assert.strictEqual(a, b, msg)` | `expect(a, msg).toBe(b)` |
| `assert.notEqual(a, b, msg)` | `expect(a, msg).not.toLooseEqual(b)` |
| `assert.notStrictEqual(a, b, msg)` | `expect(a, msg).not.toBe(b)` |
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

## Custom matchers (provided by `tests/vitest.setup.ts`)

- **`toLooseEqual(expected)`** — mirrors QUnit's `assert.equal`/`assert.notEqual` (`==` / `!=`). Use this for any direct mapping of `assert.equal`. Examples that QUnit treats as equal but `toBe` rejects: `undefined == null`, `"0" == 0`, `0 == false`. The codemod emits `toLooseEqual` automatically; do not switch to `toBe` unless you have verified strict equality is the original intent (in which case the source already used `assert.strictEqual`).

## Partial-conversion fallback (mandatory)

A test **must be left commented out** instead of converted when any of the following applies. For each such test, add a row to `packages/survey-core/vitest-migration/MANUAL-FOLLOWUP.md`.

| Reason code | Trigger |
|---|---|
| `ASYNC_DONE` | Test uses `assert.async()` or `assert.async(N)` and the rewrite to `await new Promise(...)` is non-obvious (more than one `done()` call site, conditional `done()` inside callbacks, or `done()` invoked from setTimeout chains). |
| `THROWS_SHAPE` | `assert.throws` second argument is a non-trivial Error instance, function matcher, or regex over `.message` whose Vitest equivalent is ambiguous. |
| `EQUAL_LOOSE` | **Automated** — `assert.equal`/`assert.notEqual` map to the custom `toLooseEqual` matcher (see "Custom matchers" above), preserving `==` semantics. No fallback needed. |
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
3. This stops Karma from trying to load a file that imports from `vitest` (which would cause `RollupError: "<vitest export>" is not exported by ...`).

If the file still contains commented-out QUnit code only (i.e., zero tests were converted), do **not** remove the barrel line; instead, abort and report — this prompt requires partial conversion to make progress.

### If the converted file is reverted (Vitest run fails)

When the Vitest run of the converted file fails for reasons unrelated to commented-out tests and the conversion is rolled back:
1. Restore the original QUnit source of the test file.
2. **Re-add the `export * from "../<file>";` line** to `packages/survey-core/tests/entries/test.ts` so Karma keeps running it. A reverted file MUST be in the Karma barrel; otherwise the Karma TOTAL count silently decreases.
3. After restoring, grep the barrel for the file's basename and confirm the line appears exactly once.

## Lint (mandatory after every conversion)

After the file is converted and Vitest passes for it, run ESLint with auto-fix scoped to the converted file:

```
cd packages/survey-core
npx eslint tests/<file>.ts --fix
```

The codemod's output frequently violates the project's `indent` rule (4002 errors across the slice-3 batch reduced to 0 after `--fix`) and may also misplace existing `// eslint-disable-line` comments when reordering `assert.equal(a, b, msg)` into `expect(a, msg).toBe(b)`.

Rules:
- After `--fix`, re-run `npx eslint tests/<file>.ts` (no `--fix`) and require **0 errors, 0 warnings**.
- If a residual error is a misplaced disable comment (e.g., `surveyjs/eslint-plugin-i18n/only-english-or-code`), move the comment to the line immediately preceding the offending `expect(...)` and use `eslint-disable-next-line` instead of `eslint-disable-line`.
- Re-run `npx vitest run tests/<file>.ts` after the lint fixes to confirm `--fix` did not change semantics.
- Do NOT run `npm run lint` package-wide — the survey-core baseline currently has ~83k pre-existing test-folder lint errors that are out of scope. Lint is scoped to converted files only.

## Codemod notes (`vitest-migration/codemod.mjs`)

If you use the codemod helper, be aware of these requirements (already implemented; do not regress):
- `ASSERTION_MAP` must include `notStrictEqual` → `not.toBe` in addition to `notEqual`. Older codemod versions missed it and produced `assert.notStrictEqual(...)` calls in the output that fail at runtime.
- The `describe("...", () => { ... })` wrapper must be skipped when the file contains top-level `export function`/`export const`/`export class` declarations interleaved with `QUnit.test` calls (e.g., `tests/utilstests.ts`). Wrapping breaks the exports because they end up nested inside the arrow function. Detect this by scanning for `^export (function|const|let|var|class|interface|type|enum)\s` after the `QUnit.module` line.
- Files that contain `QUnit.test` but no `QUnit.module` are valid input — skip the `describe` wrap and leave top-level `test()` calls (Vitest accepts them).
- Always run the codemod with `node --check` or a quick `tsc --noEmit` on the output before running Vitest, so syntactic regressions surface before a 30-second test run.

## Singleton cleanup

The project's QUnit tests rely on per-test trailing cleanup calls for global singletons — most commonly `ComponentCollection.Instance.clear()` (and `clear(true)` for internal components). Vitest runs all tests of a file sequentially in the same V8 isolate, so:
- A leaked singleton from test N corrupts test N+1.
- Trailing cleanup is **not run** when an earlier `expect()` in the same test throws.

**Solution:** the global `afterEach` in `tests/vitest.setup.ts` resets all known singletons after every test (see `01-setup-vitest.prompt.md` step 3). The codemod automatically strips per-test **trailing** `Singleton.Instance.clear(...)` calls (i.e., calls that immediately precede the closing `});` of the test body) since they are now redundant.

**Mid-test `clear()` calls are preserved** — some tests (e.g., `"internal boolean flag"` in `tests/question_customtests.ts`) call `clear()` between two assertion blocks to verify partial-cleanup behavior. The codemod's regex requires the closing `});` to immediately follow the `clear()` line; do not change this without verifying every preserved call.

When a converted test file fails because a singleton not yet handled by the global hook is being mutated:
1. Add a reset call to the `afterEach` in `tests/vitest.setup.ts` (single source of truth).
2. Add the corresponding match pattern to the codemod's `stripSingletonCleanup` so trailing per-test cleanup gets stripped on future conversions.
3. Re-run the file. If still failing, the issue is something other than singleton leakage.

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
