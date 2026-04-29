# Manual Follow-up Registry — survey-core Vitest Migration

This file tracks tests and files that the AI batch-conversion prompts could not fully convert from QUnit to Vitest. Each entry must be resolved by a developer before the migration's definition of done is met (see [PLAN.md](PLAN.md) §"Final definition of done").

**Convention for prompts:** when a prompt cannot safely convert a test, it must:
1. Leave the test in its original file but **wrapped in a block comment** (`/* ... */`) immediately preceded by a single-line marker comment `// VITEST-MIGRATION: MANUAL — <short reason>`.
2. Add an entry to the table below with the file path, test name, reason, and the prompt that flagged it.
3. Convert every other test in the same file normally (partial conversion is required, not optional).

**Convention for developers:** when resolving an entry, remove the marker comment, restore the test in Vitest form, run the file via `npx vitest run <file>`, and delete the corresponding row below.

## Entries

| # | File | Test name | Reason | Flagged by | Status |
|---|---|---|---|---|---|
| _none yet_ | | | | | |

## Reason categories (use one of these in the table)

| Code | Meaning |
|---|---|
| `ASYNC_DONE` | Uses `assert.async()` / `assert.async(N)`; needs control-flow rewrite to native `async`/`await` or `Promise.all`. |
| `THROWS_SHAPE` | `assert.throws(fn, expected, msg)` where `expected` is non-trivial (regex, custom matcher, instance shape) and the equivalent `expect(fn).toThrow(...)` form is ambiguous. |
| `EQUAL_LOOSE` | `assert.equal` compares cross-type values (e.g., number vs string); changing to `toBe` (strict) would change behavior. Needs developer judgment on whether to coerce or fix the test. |
| `DOM_API` | Test relies on a browser API not available or behaving differently under jsdom (e.g., `IntersectionObserver`, layout sizes, real Canvas). |
| `TIMER` | Test depends on real timers in a way that fake timers (`vi.useFakeTimers`) would change semantics. |
| `CROSS_FILE_STATE` | Test relies on global state set up by another (un-converted) test file, which Vitest's per-file isolation breaks. |
| `OTHER` | Anything else; describe in a free-form note column. |

## Free-form notes

(Append developer notes here as needed.)
