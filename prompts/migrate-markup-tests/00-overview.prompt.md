---
mode: agent
description: Overview and shared context for migrating markup tests from Karma/QUnit (and Karma/Jasmine for Angular) to Vitest across all UI packages.
---

# Migrate markup tests to Vitest — Overview

## Goal
Replace the Karma-based markup-test runners in three UI packages with Vitest. The
canonical reference implementation already exists for Vue3 and works end-to-end —
all other packages must converge on the same approach.

## Packages

| Package | Current runner | Markup spec entry | Action |
|---|---|---|---|
| `packages/survey-vue3-ui` | **Vitest (jsdom)** | [tests/test.spec.ts](packages/survey-vue3-ui/tests/test.spec.ts) | **Reference — do not change.** |
| `packages/survey-react-ui` | Karma + QUnit (Rollup-bundled) | [tests/markup.ts](packages/survey-react-ui/tests/markup.ts) | Migrate (prompt 01). |
| `packages/survey-js-ui` | Karma + QUnit (Rollup-bundled) | [tests/markup.ts](packages/survey-js-ui/tests/markup.ts) | Migrate (prompt 02). |
| `packages/survey-angular-ui` | Karma + Jasmine (`ng test`) | [test/markup/test.spec.ts](packages/survey-angular-ui/test/markup/test.spec.ts) | Migrate (prompt 03). |

The three migration prompts are independent and may be executed in parallel — they
edit disjoint files. None of them are allowed to modify shared code under
[tests/markup/](tests/markup/).

## Shared invariants (do NOT break)

1. **Do not change [tests/markup/helper.ts](tests/markup/helper.ts) or any
   `etalon*.ts` / `*.snap.html` file.** They are shared by all four packages.
2. The `testQuestionMarkup(assert, test, platform)` helper expects a QUnit-shaped
   `assert` with `assert.async()` and `assert.equal(actual, expected, msg)`.
   Vue3 already wraps Vitest's `expect` in an `ExpectAssertAdapter` — reuse the
   same shape verbatim. See lines 45–58 of
   [tests/test.spec.ts](packages/survey-vue3-ui/tests/test.spec.ts).
3. Snapshot HTML must be loaded from
   `tests/markup/snapshots/<name>.snap.html`. Pick **one** of these loader
   strategies (Vue3 uses option A):
   - **A. `fs.readFileSync`** at runtime (works in Node/jsdom).
   - **B. `import.meta.glob("…/snapshots/*.snap.html", { query: "?raw", import: "default", eager: true })`** — purely Vite-native, no plugin needed.
   Do **not** keep the `require("…snap.html")` form — it only works through the
   custom Rollup plugin in `rollup.tests.config.mjs`.
4. `ResizeObserver` must be polyfilled on `window` (see Vue3 `beforeAll`). Add
   any other browser globals only if a test actually needs them.
5. `vitest-canvas-mock` must be imported in the setup file for canvas-based
   questions (signaturepad, slider, image).
6. Keep the original Karma scripts available during transition by renaming the
   new script to `test:vitest` (or replace `test` only after the migration is
   verified — the per-prompt instructions specify which).

## Reference snippet (Vue3 — copy this pattern)

```ts
class ExpectAssertAdapter {
  constructor(private expect: any, private done: any, private reject: any) {}
  public equal(actual: any, expected: any, msg: string) {
    try { this.expect(actual, msg).toBe(expected); }
    catch (e) { this.reject(e); }
  }
  public async() { return this.done; }
}

markupTests.forEach((markupTest) => {
  it(markupTest.name, () => new Promise<void>((done, reject) => {
    testQuestionMarkup(
      new ExpectAssertAdapter(expect, done, reject),
      markupTest,
      platformDescriptor
    );
  }), 1000);
});
```

## Acceptance criteria for every migration prompt

- `npm run test` (or `npm run test:vitest`) runs Vitest, no Karma, no Rollup
  bundling step.
- All `markupTests` execute and pass under jsdom.
- The shared `tests/markup/**` files are untouched.
- The package's `karma.conf.js`, `rollup.tests.config.mjs`, and any
  `tests/bundle/` artifacts are removed (or, for Angular, the corresponding
  `karma.conf.js` / `test.ts` is removed) — but only after the new runner is
  green.
- `npm install` succeeds; new dev-deps (`vitest`, `jsdom`,
  `vitest-canvas-mock`, framework adapter) are added; obsolete Karma deps are
  removed from that package's `package.json`.

## Execution order

1. Read this overview.
2. Pick one of:
   - [01-migrate-react-ui.prompt.md](prompts/migrate-markup-tests/01-migrate-react-ui.prompt.md)
   - [02-migrate-js-ui.prompt.md](prompts/migrate-markup-tests/02-migrate-js-ui.prompt.md)
   - [03-migrate-angular-ui.prompt.md](prompts/migrate-markup-tests/03-migrate-angular-ui.prompt.md)
3. The three are independent. Run as separate sessions / subagents in parallel
   to maximize throughput.
