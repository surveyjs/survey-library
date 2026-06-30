---
description: "Convert a survey-core unit test from QUnit to Vitest"
name: "Convert Survey-core QUnit Test To Vitest"
argument-hint: "Path to a test file under packages/survey-core"
agent: "agent"
---
Migrate one survey-core unit test file from QUnit to Vitest.

Scope constraints:
- Only convert files under packages/survey-core.
- Do not modify UI package tests.
- Do not change production logic unless a test framework dependency forces a minimal, justified adjustment.

Conversion rules:
- Replace QUnit constructs with Vitest equivalents (module/test/hooks/assert).
- Preserve test names and intent.
- Keep assertions semantically equivalent.
- Preserve setup/teardown behavior.
- Keep imports clean and explicit.

Required output:
1. A concise summary of what was changed.
2. The edited file diff.
3. Any follow-up fixes needed in related survey-core test utilities.
4. A command list to run only relevant survey-core tests.

Quality checks:
- Flag ambiguous conversions instead of guessing.
- Note any behavior differences between QUnit and Vitest that could affect this file.
