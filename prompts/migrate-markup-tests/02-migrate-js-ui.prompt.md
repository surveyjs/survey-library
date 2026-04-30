---
mode: agent
description: Migrate survey-js-ui markup tests from Karma + QUnit (Rollup-bundled) to Vitest with jsdom.
---

# Migrate `survey-js-ui` markup tests to Vitest

Read [00-overview.prompt.md](prompts/migrate-markup-tests/00-overview.prompt.md)
first for shared rules. Do **not** modify [tests/markup/helper.ts](tests/markup/helper.ts)
or any file under `tests/markup/`.

## Files to study (read-only)
- [packages/survey-js-ui/tests/markup.ts](packages/survey-js-ui/tests/markup.ts) — the spec being replaced.
- `packages/survey-js-ui/karma.conf.js` — to be deleted.
- `packages/survey-js-ui/rollup.tests.config.mjs` — to be deleted.
- `packages/survey-js-ui/package.json` — scripts and devDependencies to update.
- [packages/survey-vue3-ui/vitest.config.js](packages/survey-vue3-ui/vitest.config.js) and [packages/survey-vue3-ui/tests/test.spec.ts](packages/survey-vue3-ui/tests/test.spec.ts) — reference implementation to mimic.

## Required changes

### 1. Add Vitest config
Create `packages/survey-js-ui/vitest.config.ts`:
- `environment: "jsdom"`.
- `setupFiles: ["./vitest.setup.ts"]`.
- `deps.inline: ["vitest-canvas-mock"]`.
- `resolve.dedupe: ["survey-core"]`.

Create `packages/survey-js-ui/vitest.setup.ts`:
- `import "vitest-canvas-mock";`
- Polyfill `window.ResizeObserver` (same shim as Vue3 `beforeAll`).

### 2. Rewrite the markup spec
Replace `packages/survey-js-ui/tests/markup.ts` with `tests/markup.spec.ts` that:
- Imports `describe`, `it`, `expect`, `beforeAll` from `vitest`.
- Reuses the Vue3 `ExpectAssertAdapter` pattern verbatim (see overview).
- Loads snapshots via `fs.readFileSync(path.resolve(__dirname, "../../../tests/markup/snapshots/" + snapshot + ".snap.html"), "utf-8")`. **Do not** keep `require("…snap.html")`.
- Keeps the same rendering logic (no React — uses the framework-free entry):
  ```ts
  import * as SurveyUI from "../entries/index";
  ...
  render: (survey, element) => SurveyUI.renderSurvey(survey, element),
  finish: (element) => SurveyUI.unmountComponentAtNode(element),
  ```
- Keeps the existing `eslint-disable-next-line surveyjs/no-imports-from-entries` comment.
- **Important:** the current file mistakenly sets `platformDescriptor.name = "React"` — keep this value as-is unless you confirm via `grep` that no snapshot or helper logic depends on it. Changing the name affects DOM ids in `testQuestionMarkup` (`"surveyElement" + platform.name`). Safest is to leave it `"React"`; if you decide to change to `"JS"`, document the rationale.

### 3. Update `package.json`
- Replace the `test` script:
  ```json
  "test": "vitest --no-watch --no-threads",
  "test:watch": "vitest --no-threads"
  ```
- Add devDependencies (match Vue3's versions when reasonable):
  - `vitest` (`~0.32.4`)
  - `jsdom`
  - `vitest-canvas-mock` (`^0.3.3`)
- Remove `karma`, `karma-*`, `qunit`, `karma-qunit`, and any
  rollup-tests-only plugins **after** verifying they are not used by other
  rollup configs in the package.

### 4. Delete obsolete artifacts
After the new tests pass:
- Delete `packages/survey-js-ui/karma.conf.js`.
- Delete `packages/survey-js-ui/rollup.tests.config.mjs`.
- Delete `packages/survey-js-ui/tsconfig.tests.json` if present and unused.
- Delete the generated `packages/survey-js-ui/tests/bundle/` directory and the old `tests/markup.ts`.

### 5. Verify
- `cd packages/survey-core && npm run build`.
- `cd packages/survey-js-ui && npm install`.
- `cd packages/survey-js-ui && npm run test`.
- All `markupTests` must pass. Fix jsdom gaps only in `vitest.setup.ts`.

## Out of scope
- Do not migrate Playwright e2e/vrt/a11y tests.
- Do not modify other packages or the shared `tests/markup/**`.
