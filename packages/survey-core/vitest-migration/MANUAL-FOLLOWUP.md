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
| 1 | tests/basetests.ts | "Add async event" | ASYNC_DONE | 02-convert-batch.prompt.md (slice 3) | open |
| 2 | tests/surveyElementTests.ts | "wait for elements to render RenderingCompletedAwaiter by timeout" | ASYNC_DONE | 02-convert-batch.prompt.md (slice 3) | open |
| 3 | tests/helperstests.ts | __entire_file__ | EQUAL_LOOSE | 02-convert-batch.prompt.md (slice 3) | **resolved by `toLooseEqual` matcher (EQUAL_LOOSE automation)** — codemod now maps `assert.equal`/`assert.notEqual` to a custom `toLooseEqual` matcher (defined in `tests/vitest.setup.ts`) that uses `==`. File is now converted. |
| 4 | tests/utilstests.ts | __entire_file__ | OTHER | 02-convert-batch.prompt.md (slice 3) | open — sanitizer tests rely on `document.createRange()` / browser sanitizer behavior that jsdom does not implement (DOM_API). Reverted; needs jsdom polyfill or test rewrite. |
| 5 | tests/jsonobjecttests.ts | __entire_file__ | EQUAL_LOOSE | 02-convert-batch.prompt.md (slice 3) | **resolved by `toLooseEqual` matcher (EQUAL_LOOSE automation)**, with one `test.skip` for entry #20. File is now converted. |
| 6 | tests/a11y.ts | "a11y: aria-labelledby customquestion Bug#11049" | OTHER | 02-convert-batch.prompt.md (slice 3) | **resolved by global singleton cleanup (slice 4 follow-up)** — root cause was `ComponentCollection` leakage; fixed via `afterEach` in `tests/vitest.setup.ts`. File is now converted. |
| 7 | tests/questionImagepicker.ts | __entire_file__ | DOM_API | 02-convert-batch.prompt.md (slice 4) | open — 3 tests rely on `ResizeObserver` + container visibility detection that jsdom does not implement. Reverted. |
| 8 | tests/question_baseselecttests.ts | __entire_file__ | OTHER | 02-convert-batch.prompt.md (slice 4) | open — many failures around checkbox `valuePropertyName` / `selectAll` / `defaultValue` / `comment` flows. Reverted; suspected mix of EQUAL_LOOSE and CROSS_FILE_STATE (uses `Serializer.addProperty`). |
| 9 | tests/question_customtests.ts | __entire_file__ | CROSS_FILE_STATE | 02-convert-batch.prompt.md (slice 4) | **resolved by global singleton cleanup (slice 4 follow-up)** — root cause was `ComponentCollection.Instance.clear()` being skipped after `expect()` failures, leaking custom question registrations. Fixed via `afterEach` in `tests/vitest.setup.ts`. File is now converted with 4 unrelated `test.skip` (entries 16–19 below). |
| 10 | tests/question_matrix_tests.ts | __entire_file__ | EQUAL_LOOSE | 02-convert-batch.prompt.md (slice 4) | **resolved by `toLooseEqual` matcher (EQUAL_LOOSE automation)**. File is now converted. |
| 11 | tests/question_matrixdropdownbasetests.ts | __entire_file__ | OTHER | 02-convert-batch.prompt.md (slice 4) | open — failures in matrix dropdown tests. Reverted. |
| 12 | tests/question_matrixdynamictests.ts | __entire_file__ | OTHER | 02-convert-batch.prompt.md (slice 4) | open — large file (316 tests), failures present. Reverted. |
| 13 | tests/question_ranking_tests.ts | __entire_file__ | OTHER | 02-convert-batch.prompt.md (slice 4) | open — failures in ranking tests. Reverted. |
| 14 | tests/question_slider_tests.ts | __entire_file__ | OTHER | 02-convert-batch.prompt.md (slice 4) | open — failures around `renderedValue` initial state (likely arrays — `toEqual([0,10])` mismatches actual array contents). Reverted. |
| 15 | tests/question_texttests.ts | __entire_file__ | EQUAL_LOOSE | 02-convert-batch.prompt.md (slice 4) | **resolved by `toLooseEqual` matcher (EQUAL_LOOSE automation)**. File is now converted. |
| 16 | tests/a11y.ts | "a11y: aria-labelledby" (line 113 variant) | OTHER | 02-convert-batch.prompt.md (slice 4 follow-up) | open — single test fails under jsdom (likely missing layout/ARIA-relationship API). `test.skip` applied. |
| 17 | tests/question_customtests.ts | "Single: with checkbox & showOtherItem, Bug#9929" | OTHER | 02-convert-batch.prompt.md (slice 4 follow-up) | open — `toEqual` on observable arrays surfaces extra enumerable properties (`push` etc.) that QUnit's `deepEqual` ignored. `test.skip` applied. |
| 18 | tests/question_customtests.ts | "Single: Do not focus element on setting defaultValue & on setting value to survey.data, Bug#10016" | DOM_API | 02-convert-batch.prompt.md (slice 4 follow-up) | open — relies on `document.activeElement` focus tracking jsdom does not implement correctly. `test.skip` applied. |
| 19 | tests/question_customtests.ts | "Composite: Do not focus element on setting defaultValue & on setting value to survey.data, Bug#10016" | DOM_API | 02-convert-batch.prompt.md (slice 4 follow-up) | open — same DOM_API issue as #18. `test.skip` applied. |
| 20 | tests/jsonobjecttests.ts | "multiplevalues/array property should call onPropertyChanged on modifying array" | OTHER | EQUAL_LOOSE automation follow-up | open — `toEqual` on observable arrays surfaces extra enumerable properties (`push` etc.) that QUnit's `deepEqual` ignored (same root cause as #17). `test.skip` applied. |

## Reason categories (use one of these in the table)

| Code | Meaning |
|---|---|
| `ASYNC_DONE` | Uses `assert.async()` / `assert.async(N)`; needs control-flow rewrite to native `async`/`await` or `Promise.all`. |
| `THROWS_SHAPE` | `assert.throws(fn, expected, msg)` where `expected` is non-trivial (regex, custom matcher, instance shape) and the equivalent `expect(fn).toThrow(...)` form is ambiguous. |
| `EQUAL_LOOSE` | `assert.equal` compares cross-type values (e.g., number vs string). **Automated**: codemod maps `assert.equal`/`assert.notEqual` to the custom `toLooseEqual` matcher defined in `tests/vitest.setup.ts`, which uses `==` semantics matching QUnit. No manual follow-up needed for pure EQUAL_LOOSE failures. |
| `DOM_API` | Test relies on a browser API not available or behaving differently under jsdom (e.g., `IntersectionObserver`, layout sizes, real Canvas). |
| `TIMER` | Test depends on real timers in a way that fake timers (`vi.useFakeTimers`) would change semantics. |
| `CROSS_FILE_STATE` | Test relies on global state set up by another (un-converted) test file, which Vitest's per-file isolation breaks. |
| `OTHER` | Anything else; describe in a free-form note column. |

## Free-form notes

(Append developer notes here as needed.)
