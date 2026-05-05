---
description: "Resolve manual follow-up entries from MANUAL-FOLLOWUP.md (one or more)"
name: "Resolve Manual Follow-up Entries"
argument-hint: "Entry numbers (e.g., '3,7,12') or 'all', or a single file path"
agent: "agent"
---
Resolve one or more entries in `packages/survey-core/vitest-migration/MANUAL-FOLLOWUP.md` by completing the QUnit → Vitest conversion of the commented-out tests they refer to.

This prompt is the **only** way to remove rows from the registry — every removal must correspond to a working Vitest translation of the test in question.

## Input

The argument selects which entries to resolve:
- A comma-separated list of entry numbers (the leftmost column in `MANUAL-FOLLOWUP.md`).
- `all` to attempt every open entry.
- A file path (e.g., `tests/utilstests.ts`) to attempt every open entry whose `File` column matches.

If the argument is missing or ambiguous, ask the user. If `all` is given and there are more than 10 open entries, confirm with the user before proceeding (large async-conversion batches need attention).

## Per-entry procedure

For each selected entry, in registry order:

1. Open the file referenced in the `File` column.
2. Locate the commented-out test by its name (the `Test name` column) and the `// VITEST-MIGRATION: MANUAL —` marker comment.
3. Convert the test to Vitest using the rules below for the entry's reason code.
4. Remove the marker comment and the surrounding `/* ... */` wrapper.
5. Run the file in isolation:
   ```
   cd packages/survey-core
   npx vitest run tests/<file>.ts
   ```
6. If the run passes, **delete the corresponding row** from `MANUAL-FOLLOWUP.md`.
7. If the run fails, restore the commented-out form, update the registry row's `Status` column from `open` to `attempted` and append a one-line note to the "Free-form notes" section explaining what went wrong.

## Reason-code resolution recipes

### `ASYNC_DONE`

Replace `done = assert.async()` patterns with native `async`/`await`:

```ts
// Before (commented in file):
QUnit.test("loads data", function (assert) {
  const done = assert.async();
  loadData((result) => {
    assert.equal(result, "x");
    done();
  });
});

// After:
test("loads data", async () => {
  const result = await new Promise<string>((resolve) => loadData(resolve));
  expect(result).toBe("x");
});
```

For `assert.async(N)`: collect N promises and `await Promise.all(...)`. For `done()` calls inside conditional branches: refactor into a single resolution path or use `vi.waitFor(() => expect(...))` with a clear stop condition.

### `THROWS_SHAPE`

| QUnit form | Vitest form |
|---|---|
| `assert.throws(fn, /pattern/)` | `expect(fn).toThrow(/pattern/)` |
| `assert.throws(fn, new Error("msg"))` | `expect(fn).toThrow("msg")` |
| `assert.throws(fn, MyErrorClass)` | `expect(fn).toThrow(MyErrorClass)` |
| `assert.throws(fn, (err) => err.code === 42)` | wrap manually: `try { fn(); throw new Error("did not throw"); } catch (err) { expect(err.code).toBe(42); }` |

### `EQUAL_LOOSE`

Audit the actual runtime types. Two valid resolutions:
- **The test was intentionally loose:** use `expect(String(actual)).toBe(String(expected))` or coerce one side; document briefly.
- **The test had a latent bug masked by `==`:** fix the production assertion expectation in the test and verify with the developer / a `git blame` of nearby code.

Never silently pick one; pick deliberately and note the choice in the PR.

### `DOM_API`

Options in order of preference:
1. Switch the file (or single test) to `happy-dom` via `// @vitest-environment happy-dom` directive at the top of the file.
2. Mock the missing API in `tests/vitest.setup.ts` (e.g., `IntersectionObserver` stub).
3. If neither works, mark the entry's `Status` as `requires-real-browser` and leave it for a follow-up using Playwright component tests.

### `TIMER`

Wrap the test in `vi.useFakeTimers()` / `vi.useRealTimers()`. Replace `setTimeout`-based waits with `vi.advanceTimersByTime(ms)`. Verify behavior matches the original by running both Karma (still on the original test before deletion) and Vitest side-by-side.

### `CROSS_FILE_STATE`

Move the global setup (e.g., `Serializer.addClass(...)`) into `tests/vitest.setup.ts` so every Vitest worker sees it. Verify nothing else regressed.

### `OTHER`

Read the free-form note. Resolve case-by-case; if the cause was an infrastructure gap, fix infra first then re-run the original conversion via `vitest-migration/03-convert-file.prompt.md`.

## Required output

1. Per-entry result table:

   | Entry # | File | Test | Reason | Result | Notes |
   |---|---|---|---|---|---|

2. Diff of every file modified (test files + `MANUAL-FOLLOWUP.md` + `vitest.setup.ts` if touched).
3. Vitest run result for each affected file.
4. Updated count of remaining open entries in `MANUAL-FOLLOWUP.md`.

## Quality checks

- One PR-sized batch per invocation (≤10 entries) unless explicitly told otherwise.
- Never modify `packages/survey-core/src/` from this prompt.
- Never delete a registry row without a passing Vitest run for that test.
- If a single resolution requires touching `vitest.setup.ts`, mention it explicitly in the report — shared-setup changes can affect other tests.
