# Survey-core Vitest Migration

This directory holds the migration plan, the executable prompts that drive the QUnit → Vitest migration of `packages/survey-core` unit tests, and the registry of tests that need manual developer attention.

## Files

### Plan & registry

- [PLAN.md](PLAN.md) — Concrete migration plan (slice ordering, risks, validation, definition of done).
- [MANUAL-FOLLOWUP.md](MANUAL-FOLLOWUP.md) — Registry of tests the AI could not safely convert. Updated automatically by the conversion prompts; resolved by [04-resolve-manual-followups.prompt.md](04-resolve-manual-followups.prompt.md).

### Executable prompts (numbered by execution order)

| # | Prompt | Purpose | When to run |
|---|---|---|---|
| 01 | [01-setup-vitest.prompt.md](01-setup-vitest.prompt.md) | Install Vitest, create `vitest.config.ts` and `tests/vitest.setup.ts`, validate with the pilot file. | Once, before any conversion. |
| 02 | [02-convert-batch.prompt.md](02-convert-batch.prompt.md) | Convert a slice (2, 3, 4, 5, or 6) — or any custom file list — using the partial-conversion fallback. | Per slice, repeat. |
| 03 | [03-convert-file.prompt.md](03-convert-file.prompt.md) | Convert a single file with the same rules. Use ad-hoc, or to retry one file from a batch. | As needed. |
| 04 | [04-resolve-manual-followups.prompt.md](04-resolve-manual-followups.prompt.md) | Pick up commented-out tests from `MANUAL-FOLLOWUP.md` and finish their conversion. | After each batch and as final cleanup. |
| 05 | [05-decommission-karma.prompt.md](05-decommission-karma.prompt.md) | Remove Karma, QUnit, and related configs once everything is migrated. | Last, only after preconditions pass. |

### Original meta-prompts

Moved into [initial/](initial/) — kept for reference and re-runs of the planning step.

- [initial/1-survey-core-vitest-migration-plan.prompt.md](initial/1-survey-core-vitest-migration-plan.prompt.md) — Regenerates [PLAN.md](PLAN.md) from scratch if scope changes.
- [initial/2-survey-core-convert-qunit-to-vitest.prompt.md](initial/2-survey-core-convert-qunit-to-vitest.prompt.md) — Original strict single-file conversion prompt (no fallback). Superseded for normal use by [03-convert-file.prompt.md](03-convert-file.prompt.md).
- [initial/3-survey-core-vitest-migration-review.prompt.md](initial/3-survey-core-vitest-migration-review.prompt.md) — Reviews a converted slice for parity and risk.

## Workflow

```
one-time:   01-setup-vitest.prompt.md
              │
              ▼
per slice:  02-convert-batch.prompt.md  <slice number>
              ├── auto-converts most tests in each file
              └── records hard cases in MANUAL-FOLLOWUP.md
            (optional) initial/3-survey-core-vitest-migration-review.prompt.md
            (optional) 04-resolve-manual-followups.prompt.md
              │
              ▼
cleanup:    04-resolve-manual-followups.prompt.md  all
              (until MANUAL-FOLLOWUP.md is empty)
              │
              ▼
last:       05-decommission-karma.prompt.md
```

## Partial-conversion contract

Every conversion prompt that touches a test file follows the same contract (defined in detail in [03-convert-file.prompt.md](03-convert-file.prompt.md)):

1. **Convert as much as possible.** Mechanical mappings (`assert.equal` → `expect().toBe`, `QUnit.test` → `test`, etc.) are applied automatically.
2. **Comment out what cannot be safely converted.** A test that would require non-trivial control-flow rewrites, ambiguous matchers, cross-type comparisons, or unsupported DOM APIs is left in place inside a `/* ... */` block, immediately preceded by `// VITEST-MIGRATION: MANUAL — <REASON_CODE>: <note>`.
3. **Record every commented-out test in [MANUAL-FOLLOWUP.md](MANUAL-FOLLOWUP.md).**
4. **Remove the file's barrel entry** from `tests/entries/test.ts` so Karma stops loading it.
5. **Verify with `npx vitest run tests/<file>.ts`** before reporting success.

This guarantees: developers never have to "find" what was skipped — both the inline markers and the registry point to every spot that needs human attention, and the surrounding scaffolding is already done.

## Scope

**survey-core only.** Do not touch `survey-react-ui`, `survey-angular-ui`, `survey-vue3-ui`, or `survey-js-ui`.
