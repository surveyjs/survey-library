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
   - Revert this file's edits (restore the original QUnit version of the test file).
   - **Restore the `export * from "../<file>";` line in `packages/survey-core/tests/entries/test.ts`** — without this, Karma silently stops running the file and the full-suite TOTAL count drops without a failure. After restoring, grep the barrel to confirm the line is present exactly once.
   - Append a row to `MANUAL-FOLLOWUP.md` with the file path, test name `__entire_file__`, reason code `OTHER`, and a one-line description of the failure.
   - Continue with the next file in the list.
6. If the Vitest run **passes**, commit-style summary line to the report (no actual git commit).

### Setup-file maintenance after every conversion

After every successful per-file conversion (step 6) and after every revert (step 5), verify the runner setup is still consistent:

- `tests/entries/test.ts` (Karma barrel) contains an `export * from "../<file>";` line for **every un-converted** test file and for **no converted** test file. Run a quick grep over the barrel against the converted-file list before moving to the next file.
- `vitest.config.ts` uses the dynamic include filter from `01-setup-vitest.prompt.md`; do not switch to a static glob even temporarily — it will pick up un-converted QUnit files and produce a flood of `ReferenceError: QUnit is not defined`.
- If the barrel and the converted set are inconsistent, fix the barrel before running Karma. A drifted barrel manifests as either:
  - Karma `RollupError: "<vitest export>" is not exported by ...` (converted file still in barrel), or
  - Karma TOTAL silently lower than expected (un-converted file removed from barrel).

After all files are processed, run the remaining Karma suite once to confirm nothing un-converted broke:
```
cd packages/survey-core
npm run test
```

Then run ESLint with auto-fix across the **fully-converted files of this batch** (skip reverted files — they are back to original QUnit and out of scope for this prompt):

```
cd packages/survey-core
npx eslint tests/<file1>.ts tests/<file2>.ts ... --fix
npx eslint tests/<file1>.ts tests/<file2>.ts ...   # verify 0 errors, 0 warnings
```

Then re-run Vitest once across the whole project to confirm the lint auto-fixes did not change semantics:

```
cd packages/survey-core
npm run test:vitest
```

Do NOT run `npm run lint` package-wide — the test folder has ~83k pre-existing baseline errors that are out of scope. Lint must be scoped to the converted files of the current batch.

## Required output (single consolidated report)

1. **Per-file table:**

   | File | Tests total | Converted | Commented (with codes) | Vitest result | Lint result | Notes |
   |---|---|---|---|---|---|---|

2. **Aggregate counts:** files attempted / files fully converted / files partially converted / files reverted.
3. **Karma full-suite result** after all conversions.
4. **Lint summary** for the converted files (must be 0 errors, 0 warnings after `--fix`).
5. **Final state of `MANUAL-FOLLOWUP.md`** (only the rows added in this batch).
6. **Recommended next slice** based on remaining work in `PLAN.md`.

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
