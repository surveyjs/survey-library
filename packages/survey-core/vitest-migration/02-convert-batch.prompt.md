---
description: "Batch-convert a list of survey-core test files from QUnit to Vitest"
name: "Convert Survey-core Test Files in Batch"
argument-hint: "Slice number (e.g., '2'), or a comma-separated list of file paths under packages/survey-core/tests"
agent: "agent"
---
Execute the rules in `vitest-migration/03-convert-file.prompt.md` against every file in the given slice / list, in order. Each file is converted in a single pass; tests that cannot be safely converted are left commented out and recorded in `MANUAL-FOLLOWUP.md` (see fallback rules in `03-convert-file.prompt.md`).

## Input

The argument is one of:
- A slice number (`2`, `3`, `4`, `5`, or `6`) — resolve the file list from `vitest-migration/PLAN.md` §3 for that slice and process them in the listed order.
- A comma-separated list of paths (e.g., `tests/lowercasetests.ts,tests/cssClassBuilderTests.ts`) — process in the given order.

If the argument is missing or ambiguous, ask the user.

## Per-file procedure

For each file in the resolved list, in order:

1. Read the file and inventory its `QUnit.test`, `QUnit.skip`, and module-level side effects.
2. Apply the conversion rules from `vitest-migration/03-convert-file.prompt.md`:
   - Convert every test that does **not** trigger a fallback reason code.
   - Comment out (with marker) every test that does trigger a fallback, and append a row to `MANUAL-FOLLOWUP.md`.
3. Remove the file's `export *` line from `packages/survey-core/tests/entries/test.ts`.
4. Run the file in isolation:
   ```
   cd packages/survey-core
   npx vitest run tests/<file>.ts
   ```
5. If the Vitest run **fails** (for reasons unrelated to commented-out tests):
   - Revert this file's edits (restore the original QUnit version and the barrel line).
   - Append a row to `MANUAL-FOLLOWUP.md` with the file path, test name `__entire_file__`, reason code `OTHER`, and a one-line description of the failure.
   - Continue with the next file in the list.
6. If the Vitest run **passes**, commit-style summary line to the report (no actual git commit).

After all files are processed, run the remaining Karma suite once to confirm nothing un-converted broke:
```
cd packages/survey-core
npm run test
```

## Required output (single consolidated report)

1. **Per-file table:**

   | File | Tests total | Converted | Commented (with codes) | Vitest result | Notes |
   |---|---|---|---|---|---|

2. **Aggregate counts:** files attempted / files fully converted / files partially converted / files reverted.
3. **Karma full-suite result** after all conversions.
4. **Final state of `MANUAL-FOLLOWUP.md`** (only the rows added in this batch).
5. **Recommended next slice** based on remaining work in `PLAN.md`.

## Quality checks

- Process files strictly in the listed order — order in the plan accounts for dependencies.
- Do not run files in parallel; Vitest's worker isolation is fine, but the report must be deterministic.
- Do not modify `packages/survey-core/src/` under any circumstance in this prompt.
- Do not edit `PLAN.md` in this prompt; the status log is updated by the review prompt at `vitest-migration/initial/3-survey-core-vitest-migration-review.prompt.md`.
- If `MANUAL-FOLLOWUP.md` does not yet exist, abort and ask the user to run `vitest-migration/01-setup-vitest.prompt.md` first (it should already exist).

## Stop conditions (report and halt the batch)

- More than 25% of files in the batch had to be reverted (reason code `OTHER`) — indicates a systemic issue (e.g., Vitest infra missing, jsdom inadequate). Report findings and stop.
- Karma full-suite run fails after the batch — indicates a barrel edit broke an un-converted file's dependency. Investigate before continuing.
- `vitest.config.ts` or `tests/vitest.setup.ts` is missing — `vitest-migration/01-setup-vitest.prompt.md` has not been completed.

## Notes

- Slices 2–4 should aim for ≥95% automatic conversion (almost no fallbacks expected).
- Slice 5 is expected to have many `ASYNC_DONE` and `DOM_API` fallbacks — that is acceptable.
- Slice 6 (`surveytests.ts`) should be run as its own batch (single-file list) due to size.
