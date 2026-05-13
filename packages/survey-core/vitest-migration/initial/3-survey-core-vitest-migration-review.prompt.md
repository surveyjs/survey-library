---
description: "Review survey-core QUnit-to-Vitest migration for parity and risk"
name: "Review Survey-core Vitest Migration"
argument-hint: "Changed files, PR scope, or test areas to review"
agent: "agent"
---
Review a survey-core-only migration from QUnit to Vitest.

Scope constraints:
- Evaluate only packages/survey-core unit test changes.
- Ignore UI package migration concerns.

Review goals:
- Verify assertion parity and test intent preservation.
- Check hook/lifecycle conversion correctness.
- Identify flakiness risks introduced by async/timer/mock changes.
- Find missing edge cases or accidental test weakening.
- Confirm migration consistency across files.

Output format:
1. Findings first, ordered by severity.
2. Exact file references for each finding.
3. Suggested fixes for each issue.
4. Residual risks and recommended extra tests.
5. Final readiness verdict for survey-core migration slice.

Be strict about behavioral equivalence and maintainability.
