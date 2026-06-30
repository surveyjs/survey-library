---
description: "Resolve survey-core tests left as test.skip pending product-behavior decisions (not jsdom problems)."
name: "Resolve product-behavior TODO skips"
agent: "agent"
---
A handful of survey-core `test.skip` entries are not jsdom problems — they were left skipped because the production behavior they assert is intentionally **not implemented yet** (or pending a decision). Each entry below needs a product call before it can be un-skipped or deleted.

## Working directory

```
cd packages/survey-core
```

## In-scope tests

### `tests/surveytriggertests.ts`
| Line | Test | Tracking |
|---|---|---|
| 403 | `copyvalue vs expression on changing fromName. We may want to introduce this behavior #10192` | Issue [#10192](https://github.com/surveyjs/survey-library/issues/10192) |

The test asserts a behavior the team explicitly tagged as "we may want to introduce". Action:
1. Re-read the assertions in the test against the current `SurveyTriggerCopyValue` / `SurveyTriggerRunExpression` implementations.
2. Confirm with the issue owner whether the behavior is now expected.
3. **If yes** — implement the behavior in `src/trigger.ts`, un-skip the test, drop the `#10192` mention from the title.
4. **If no** — leave the skip but update the comment to `// Skipped: pending product decision — see #10192` (drop the trailing "We may want to introduce this behavior" so the marker is unambiguous).

### `tests/inputPerPageTests.ts`
| Line | Test | Tracking |
|---|---|---|
| 2332 | `singleInput bradscrum navigation for 3 level dynamic panels` | inline `//TODO re-think this test. We need to include summaries into brasdscrum navigation` |

The TODO predates the test; the breadcrumb navigation contract for nested dynamic panels is undecided. Action:
1. File a tracking issue if none exists ("singleInput breadcrumb navigation: include summaries for 3-level dynamic panels").
2. Replace the TODO with `// Skipped: pending product spec — see #<new-issue>`.
3. If the spec already landed, port the assertions to the current breadcrumb shape and un-skip.

### `tests/dragdropcoretests.ts`
| Line | Test |
|---|---|
| 23 | `Show/hide new created item, simple test` (despite the name, asserts `scrollByDrag` math against real `scrollTop`/`clientHeight`) |

This test is mis-named for the assertion it makes (it really is a `scrollByDrag` math test). Two paths:
1. **Rename + un-skip** by stubbing the container's `clientWidth`/`clientHeight`/`scrollTop` (pure math test, no real layout needed) — overlap with [01-jsdom-layout.prompt.md](01-jsdom-layout.prompt.md). Prefer this if the math is reachable.
2. If the math depends on browser scroll wheel deltas, move to a Playwright spec under `packages/survey-react-ui/e2e/`.

### `tests/paneltests.ts`
| Line | Test |
|---|---|
| 1759 | `Check panel styles with originalPage and showPreview` |

The panel CSS-class application path under `showPreview` was reworked since the test was written. Action:
1. Re-read the production `Panel.cssClasses` getter for the `showPreview` branch.
2. Decide whether the original CSS-class assertions are still valid:
   - **Still valid** — un-skip, fix selectors if class names changed.
   - **No longer valid** — delete the test (preferred over leaving a stale skip) and add a brief note in the PR.

## Resolution recipes

For every entry:

1. **Read the test body** end-to-end and the production code it touches.
2. **Decide one of three outcomes:**
   - **Implement & un-skip**: production change required → out of scope for this prompt; open a separate PR and link the issue.
   - **Reframe & un-skip**: assertion is still valid against current behavior → fix the test, remove the skip, update the marker comment.
   - **Delete**: the assertion is obsolete → remove the test entirely; mention deletion in the PR description.
3. Run `npx vitest run tests/<file>.ts` after every change.

## Required output

1. Per-test decision table:

   | File | Line | Test | Decision (implement / reframe / delete / leave-skipped-with-issue) | Issue link | Vitest result |
   |---|---|---|---|---|---|

2. For "leave-skipped-with-issue" rows: the new/updated `// Skipped:` comment text.
3. For "implement" rows: a separate PR link (do not bundle production changes into this prompt's PR).
4. Diff of every modified file.
5. `npm run test` regression check from `packages/survey-core`.

## Quality checks

- Never silently delete a skipped test without recording the rationale in the PR description.
- Never modify `packages/survey-core/src/` from this prompt — production behavior changes belong in a separate, reviewed PR.
- A "leave-skipped-with-issue" row must point to a real GitHub issue (file one if needed).
