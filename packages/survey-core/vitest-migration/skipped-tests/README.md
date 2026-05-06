# Un-skip Plan — survey-core Vitest suite

After the QUnit → Vitest migration, ~55 tests in `packages/survey-core/tests/**` are still marked `test.skip`. Each one has a single-line `// Skipped: <reason>` (or `// VITEST-MIGRATION: MANUAL —`) marker comment immediately above. This folder contains one prompt per **failure category**; each prompt enumerates the tests that fall into that category and gives a concrete recipe to either un-skip them in jsdom or migrate them out of the unit suite.

## Categories

| # | Prompt | Category | Approx. test count |
|---|---|---|---|
| 1 | [01-jsdom-layout.prompt.md](01-jsdom-layout.prompt.md) | Tests that need real layout / scroll / focus / `matchMedia` / RTL / `ResizeObserver` / `getBoundingClientRect` | ~35 |
| 2 | [02-raf-animation.prompt.md](02-raf-animation.prompt.md) | Tests that depend on `requestAnimationFrame` loops or CSS-driven animation timing | ~8 |
| 3 | [03-canvas-image.prompt.md](03-canvas-image.prompt.md) | Tests that depend on real canvas color normalization or `<img>` `onerror` lifecycle | ~4 |
| 4 | [04-missing-dom-apis.prompt.md](04-missing-dom-apis.prompt.md) | Tests that depend on `Selection.modify()`, `CSS.escape`, or comma-separated CSS shorthand parsing | ~6 |
| 5 | [05-product-todo.prompt.md](05-product-todo.prompt.md) | Tests left skipped pending product-behavior decisions (not a jsdom problem) | ~4 |

## Conventions

- Each prompt is invoked **per category, one file at a time**. Do not batch across categories.
- Never modify `packages/survey-core/src/` from these prompts — they exist to make tests run, not to change behavior.
- Shared infra changes (e.g., to `tests/vitest.setup.ts`) must be called out explicitly because they affect every other test file.
- A test that genuinely cannot run under jsdom should be **moved** to a Playwright/component test in the appropriate UI package, not deleted. If moving is out of scope, leave the `test.skip` and update its `// Skipped:` marker to point to the issue/PR that tracks the migration.
- Run the affected file in isolation after every change: `cd packages/survey-core && npx vitest run tests/<file>.ts`.

## Definition of done (per prompt)

1. Every `test.skip` listed in the prompt is either:
   - Converted to `test(...)` and passing, or
   - Re-homed to a Playwright/component test (with a link in the marker comment), or
   - Documented as `requires-real-browser` with a tracking issue.
2. `npx vitest run tests/<file>.ts` reports zero failures and zero unexpected skips.
3. The `// Skipped:` marker comment is removed for every un-skipped test.
4. No regression in the rest of the survey-core suite: `npm run test` from `packages/survey-core` still passes.
