---
description: "Decommission Karma+QUnit from survey-core after all tests are migrated"
name: "Survey-core Vitest — Decommission Karma"
agent: "agent"
---
Remove Karma+QUnit from `packages/survey-core` once every test file has been migrated to Vitest. **Run only after** `MANUAL-FOLLOWUP.md` has zero open entries and every file in `tests/` runs under Vitest.

Scope constraints:
- Touch only files inside `packages/survey-core/`, plus the CI pipeline and `.github/copilot-instructions.md`.
- Do not modify UI packages.
- Do not modify production source.

## Preconditions (verify before any deletion)

1. `MANUAL-FOLLOWUP.md` table contains zero rows with status other than `resolved`/`closed` (or no rows at all).
2. `grep -rE "QUnit\.|assert\." packages/survey-core/tests/` returns no matches.
3. `packages/survey-core/tests/entries/test.ts` contains only side-effect imports (locales, settings) — no `export *` lines.
4. `npx vitest run` from `packages/survey-core` exits 0 with test count ≥ original Karma test count.

If any precondition fails, **stop and report**; do not delete anything.

## Required actions (after preconditions pass)

1. **Replace test scripts in `packages/survey-core/package.json`**:
   - `"test": "vitest run"`
   - `"test:watch": "vitest"`
   - Remove `"test:vitest"` and `"test:vitest:watch"` aliases (now redundant).
   - Remove `"test:postcss"` only if it was Karma-coupled (verify first).

2. **Remove Karma/QUnit devDependencies** from `packages/survey-core/package.json`:
   - `karma`, `karma-chrome-launcher`, `karma-junit-reporter`, `karma-qunit`
   - `qunit`, `@types/qunit`

3. **Delete files**:
   - `packages/survey-core/karma.conf.js`
   - `packages/survey-core/rollup.tests.config.mjs`
   - `packages/survey-core/test-watch.mjs`
   - `packages/survey-core/tests/entries/test.ts` (and the `tests/entries/` directory if empty)
   - `packages/survey-core/tsconfig.tests.json` — only if no remaining file references it; otherwise update it to drop `"qunit"` from `types` and to point at `tests/**/*.ts` directly.
   - Move the locale imports and `settings` mutations from `tests/entries/test.ts` into `tests/vitest.setup.ts` first if not already there.

4. **Update `vitest.config.ts`** to reflect the absence of the barrel.

5. **Update CI** (`azure-pipelines/master/`):
   - Replace any `karma` invocations with `npm run test`.
   - Confirm Karma-specific reporter outputs (e.g., JUnit XML paths) are still produced or removed from CI artifact uploads.

6. **Update `.github/copilot-instructions.md`** test-running section:
   - Replace the survey-core Karma+QUnit description with Vitest.
   - Update the token-saving tip about Karma's verbose output.

7. **Run final validation**:
   ```
   cd packages/survey-core
   npm install
   npm run test
   ```
   Then confirm UI packages still build/test (smoke check, do not run full Playwright matrix in this prompt):
   ```
   cd packages/survey-react-ui
   npm run build
   ```

## Required output

1. Precondition checklist with pass/fail for each item.
2. Diff of every file modified or deleted (or a list of deletions if diffs are too large).
3. Output of the final `npm run test` from `packages/survey-core`.
4. Output (or summary) of the UI package smoke check.
5. Migration definition-of-done checklist from `PLAN.md` §"Final definition of done", with each item ticked.

## Stop conditions (report and halt)

- Any precondition fails.
- The final Vitest run fails or reports fewer tests than the original Karma run.
- Any UI package smoke build fails.
- `azure-pipelines/master/` references Karma in a way this prompt cannot safely edit (e.g., shared script file).

## Rollback note

Tag the commit immediately before this slice as `pre-karma-removal`. If something regresses post-merge, revert to that tag and reinstate the Karma scripts and configs from git history.
