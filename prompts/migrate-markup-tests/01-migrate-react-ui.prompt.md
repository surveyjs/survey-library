---
mode: agent
description: Migrate survey-react-ui markup tests from Karma + QUnit (Rollup-bundled) to Vitest with jsdom.
---

# Migrate `survey-react-ui` markup tests to Vitest

Read [00-overview.prompt.md](prompts/migrate-markup-tests/00-overview.prompt.md)
first for shared rules. Do **not** modify [tests/markup/helper.ts](tests/markup/helper.ts)
or any file under `tests/markup/`.

## Files to study (read-only)
- [packages/survey-react-ui/tests/markup.ts](packages/survey-react-ui/tests/markup.ts) — the spec being replaced.
- [packages/survey-react-ui/karma.conf.js](packages/survey-react-ui/karma.conf.js) — to be deleted.
- [packages/survey-react-ui/rollup.tests.config.mjs](packages/survey-react-ui/rollup.tests.config.mjs) — to be deleted; note the snapshot-loading plugin is no longer needed.
- [packages/survey-react-ui/package.json](packages/survey-react-ui/package.json) — scripts and devDependencies to update.
- [packages/survey-vue3-ui/vitest.config.js](packages/survey-vue3-ui/vitest.config.js) and [packages/survey-vue3-ui/tests/test.spec.ts](packages/survey-vue3-ui/tests/test.spec.ts) — reference implementation to mimic.

## Required changes

### 1. Add Vitest config
Create `packages/survey-react-ui/vitest.config.ts`:
- `environment: "jsdom"`.
- `setupFiles: ["./vitest.setup.ts"]`.
- `deps.inline: ["vitest-canvas-mock"]`.
- `resolve.dedupe: ["survey-core"]`.

Create `packages/survey-react-ui/vitest.setup.ts`:
- `import "vitest-canvas-mock";`
- Polyfill `window.ResizeObserver` (same shim as Vue3 `beforeAll`).

### 2. Rewrite the markup spec
Replace [packages/survey-react-ui/tests/markup.ts](packages/survey-react-ui/tests/markup.ts)
with a `tests/markup.spec.ts` (or rename and rewrite in place) that:
- Imports `describe`, `it`, `expect`, `beforeAll` from `vitest`.
- Reuses the Vue3 `ExpectAssertAdapter` pattern verbatim.
- Loads snapshots via `fs.readFileSync(path.resolve(__dirname, "../../../tests/markup/snapshots/" + snapshot + ".snap.html"), "utf-8")` (Vue3 style). **Do not** keep the `require("…snap.html")` form.
- React rendering uses the existing approach:
  ```ts
  import { Survey as SurveyReact } from "../entries/index";
  import React from "react";
  import ReactDOM from "react-dom";
  import { act } from "react-dom/test-utils";
  ```
  Inside `render`, wrap `ReactDOM.render(...)` in `act(() => { ... })` exactly as today.
- Keeps the `eslint-disable-next-line surveyjs/no-imports-from-entries` and
  `eslint-disable-next-line react/no-deprecated` comments.
- `platformDescriptor.name` stays `"React"`.

### 3. Update `package.json`
- Replace the `test` script:
  ```json
  "test": "vitest --no-watch --no-threads",
  "test:watch": "vitest --no-threads"
  ```
- Add devDependencies (match Vue3's versions when reasonable):
  - `vitest` (`~0.32.4` — same as Vue3)
  - `jsdom`
  - `vitest-canvas-mock` (`^0.3.3`)
- Remove devDependencies that are now unused: `karma`, `karma-*`, `qunit`, `karma-qunit`, the rollup-tests-only plugins (`@rollup/plugin-typescript`, `@rollup/plugin-replace`, `@rollup/plugin-commonjs`, `@rollup/plugin-node-resolve`) **only if** they are not used by any other rollup config in the package — verify with `grep`.

### 4. Delete obsolete artifacts
After the new tests pass:
- Delete `packages/survey-react-ui/karma.conf.js`.
- Delete `packages/survey-react-ui/rollup.tests.config.mjs`.
- Delete `packages/survey-react-ui/tsconfig.tests.json` (verify nothing else references it).
- Delete the generated `packages/survey-react-ui/tests/bundle/` directory and the old `tests/markup.ts` (replaced by the new spec).
- Delete `packages/survey-react-ui/test-watch.mjs` if it only orchestrated Karma — verify by reading it first.

### 5. Verify
- `cd packages/survey-core && npm run build` (prerequisite — survey-core must be built).
- `cd packages/survey-react-ui && npm install`.
- `cd packages/survey-react-ui && npm run test`.
- All `markupTests` must pass. If a small number fail because of jsdom-specific
  attribute ordering or missing browser globals, fix by adding mocks in
  `vitest.setup.ts` — **do not** change the shared helper or snapshots.

## Out of scope
- Do not touch the bundle tests under `packages/survey-react-ui/tests/bundle/`
  unless they are Karma-only outputs of the markup test (the directory contains
  the rollup output `test.js` — that is safe to delete).
- Do not migrate Playwright e2e/vrt/a11y tests.
- Do not modify other packages.
