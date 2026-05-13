---
description: "Plan migration of survey-core unit tests from QUnit to Vitest only"
name: "Survey-core Vitest Migration Plan"
argument-hint: "Scope, constraints, or target folders in packages/survey-core"
agent: "agent"
---
Create a concrete migration plan to move unit tests from QUnit to Vitest for survey-core only.

Hard scope limits:
- Work only in packages/survey-core.
- Do not propose changes for UI packages (survey-react-ui, survey-angular-ui, survey-vue3-ui, survey-js-ui).
- Keep existing behavior, assertions intent, and test coverage parity.

Output format:
1. Current-state assumptions (what to confirm before starting).
2. QUnit to Vitest API mapping table tailored to likely survey-core patterns.
3. Step-by-step migration sequence in small PR-sized slices.
4. Risks and regressions to watch for.
5. Validation strategy and commands for survey-core unit tests.
6. Rollback strategy if a slice fails.

Additional requirements:
- Prefer incremental migration over a big-bang rewrite.
- Call out where codemods can help and where manual edits are safer.
- Include a final definition of done for survey-core unit tests.
