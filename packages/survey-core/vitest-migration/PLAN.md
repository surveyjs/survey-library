# Survey-core QUnit → Vitest Migration Plan

This plan was produced by executing [initial/1-survey-core-vitest-migration-plan.prompt.md](initial/1-survey-core-vitest-migration-plan.prompt.md) against the current state of `packages/survey-core`.

Scope: **survey-core unit tests only.** UI packages (`survey-react-ui`, `survey-angular-ui`, `survey-vue3-ui`, `survey-js-ui`) are out of scope.

## 1. Current-state assumptions (confirm before starting)

| # | Assumption | How to confirm |
|---|---|---|
| A1 | Tests live only under `packages/survey-core/tests/`, bundled via `tests/entries/test.ts` and run by Karma+QUnit per `karma.conf.js` and `rollup.tests.config.mjs`. | `npm run test` from `packages/survey-core` — confirmed working baseline. |
| A2 | No QUnit module hooks (`hooks.beforeEach/afterEach`) are used. | Confirmed via grep — zero matches. |
| A3 | QUnit features actually in use: `QUnit.module`, `QUnit.test`, `QUnit.skip`, `assert.equal`, `assert.deepEqual`, `assert.notEqual`, `assert.ok`, `assert.notOk`, `assert.strictEqual`, `assert.async`, `assert.throws`. No `assert.step`/`verifySteps`/`expect(n)`/`assert.timeout`/`QUnit.todo`/`QUnit.begin`/`QUnit.done`. | Confirmed via grep. |
| A4 | UI packages consume `survey-core` via the symlinked `build/` output, not test source. | Out of scope per prompt; no changes there. |
| A5 | Tests touch DOM (e.g., `document`, image loading, popups, drag-and-drop). Vitest needs `jsdom` or `happy-dom`. | Confirm by inspecting tests like `question_imagemap_tests.ts`, `components/popuptests.ts`. |
| A6 | `Serializer.addClass(...)` runs at module top-level in many test files and registers global types. Conversion must preserve module load order so registrations happen before tests that depend on them. | Confirmed in `bindablePropertiesTests.ts`. |
| A7 | Some files set global state (`settings.animationEnabled = false`) in `tests/entries/test.ts`. Vitest needs an equivalent setup file. | Confirmed at end of `test.ts`. |
| A8 | Tests rely on the order they appear in `entries/test.ts` only loosely — Karma+QUnit run them sequentially in a single page; Vitest runs each file in its own worker by default (isolated). | Watch for tests that secretly depend on `Serializer` mutations from previous files. |

## 2. QUnit → Vitest API mapping

| QUnit construct | Vitest equivalent | Notes |
|---|---|---|
| `export default QUnit.module("Name")` | `describe("Name", () => { /* tests */ })` | Drop the default export; consumers in `entries/test.ts` only use side-effects. |
| `QUnit.test(name, fn)` | `test(name, fn)` (inside the `describe`) | |
| `QUnit.test(name, async function(assert){...})` | `test(name, async () => {...})` | |
| `QUnit.skip(name, fn)` | `test.skip(name, fn)` | |
| `QUnit.only` (none in code today) | `test.only` | |
| `assert.equal(a, b, msg)` | `expect(a, msg).toBe(b)` | **Strictness change** (`==` → `Object.is`). Audit primitive-vs-string comparisons. |
| `assert.strictEqual(a, b, msg)` | `expect(a, msg).toBe(b)` | Direct equivalent. |
| `assert.notEqual(a, b, msg)` | `expect(a, msg).not.toBe(b)` | Same strictness caveat. |
| `assert.deepEqual(a, b, msg)` | `expect(a, msg).toEqual(b)` | |
| `assert.notDeepEqual(a, b, msg)` | `expect(a, msg).not.toEqual(b)` | |
| `assert.ok(x, msg)` | `expect(x, msg).toBeTruthy()` | |
| `assert.notOk(x, msg)` | `expect(x, msg).toBeFalsy()` | |
| `assert.throws(fn, expected, msg)` | `expect(fn, msg).toThrow(expected)` | When `expected` is `new Error("msg")`, use `.toThrow("msg")` or `.toThrow(Error)`. |
| `const done = assert.async()` | Convert test to `async` + `await new Promise(resolve => ...)` OR use `vi.waitFor(...)` | **Manual review required.** No automatic codemod. |
| `const done = assert.async(N)` | Track N resolutions manually; `Promise.all([...])` of N promises | Manual. |
| `QUnit.module(name, hooks => { hooks.beforeEach(...) })` | `describe(name, () => { beforeEach(...) })` | **Not used in survey-core.** |
| Module-level `Serializer.addClass(...)` | Keep at module top-level, identical placement | Top-level code in Vitest test files runs once per worker. |
| Default export of `QUnit.module(...)` consumed by `entries/test.ts` | Remove the default export; remove the `export *` line from the barrel (Vitest discovers `*.test.ts` itself). | See migration sequence below. |

## 3. Step-by-step migration sequence (PR-sized slices)

### Slice 0 — Infrastructure (no test files converted yet)

1. Add devDependencies to `packages/survey-core/package.json`: `vitest`, `jsdom` (or `happy-dom`), `@vitest/coverage-v8` (optional).
2. Create `packages/survey-core/vitest.config.ts`:
   - `test.environment: "jsdom"`
   - `test.include: ["tests/**/*.ts"]` initially scoped via `test.includeSource` or a glob like `tests/**/*.vitest.ts` if running side-by-side.
   - `test.setupFiles: ["./tests/vitest.setup.ts"]`.
3. Create `tests/vitest.setup.ts` mirroring the side-effect lines at the bottom of `tests/entries/test.ts` (localization imports, `settings.animationEnabled = false`, `settings.dropdownSearchDelay = 0`).
4. Add scripts: `"test:vitest": "vitest run"`, `"test:vitest:watch": "vitest"`.
5. Keep Karma fully operational; both runners coexist during migration.
6. **Definition of done for Slice 0:** `npm run test:vitest` exits 0 and reports "no tests found" (or runs the one already-converted `bindablePropertiesTests.ts`).

### Convention for migration slices

- **Option A (recommended):** Convert in place, remove the file from `tests/entries/test.ts` in the same commit. Vitest picks it up via glob; Karma stops loading it. Single source of truth, no duplication.
- **Option B:** Rename converted file to `*.vitest.ts`, leave QUnit version until parity proven. Higher safety, more churn.

### Slice 1 — Pilot (already done)

- `tests/bindablePropertiesTests.ts` ✅ converted.
- **Outstanding:** remove its line from `tests/entries/test.ts` and confirm Vitest run is green.

### Slice 2 — Leaf files (no `assert.async`, no `Serializer` mutation, ≤500 lines)

Run prompt 2 once per file, in this order:

1. `tests/lowercasetests.ts`
2. `tests/cssClassBuilderTests.ts`
3. `tests/randomSeed_test.ts`
4. `tests/getOwner_test.ts`
5. `tests/propertyNameArray_tests.ts`
6. `tests/doubleBracesTests.ts`
7. `tests/renderFactoryTests.ts`
8. `tests/elementslayouttests.ts`
9. `tests/textPreprocessorTests.ts`
10. `tests/calculatedvaluestests.ts`

### Slice 3 — Helpers, base, utilities (medium, mostly sync)

11. `tests/helperstests.ts`
12. `tests/basetests.ts` — has 1 `assert.async` (line 69)
13. `tests/utilstests.ts` — has `assert.async` and `assert.throws`
14. `tests/jsonobjecttests.ts`
15. `tests/jsonSchemaTests.ts`
16. `tests/localizablestringtests.ts`
17. `tests/surveyLocalizationTests.ts`
18. `tests/surveyElementTests.ts`
19. `tests/editingObjectTests.ts`
20. `tests/a11y.ts`

### Slice 4 — Question types (mostly sync, well-isolated)

21. `questionBooleanTests.ts`, `question_baseselecttests.ts`, `question_comment_tests.ts`, `question_customtests.ts`, `question_expressiontests.ts`, `question_imagetests.ts`, `question_imagepickertests.ts`, `question_matrix_base_tests.ts`, `question_matrix_tests.ts`, `question_matrixdropdownbasetests.ts`, `question_matrixdynamictests.ts`, `question_multipletexttests.ts`, `question_paneldynamic_tests.ts`, `question_ranking_tests.ts`, `question_ratingtests.ts`, `question_signaturepadtests.ts`, `question_slider_tests.ts`, `question_tagbox_tests.ts`, `question_texttests.ts`, `questionImagepicker.ts`, `questionFileTests.ts`.

### Slice 5 — Async-heavy / DOM-heavy files (careful manual conversion)

- `questionDropdownTests.ts` (15+ `assert.async`) — convert async tests to native `async/await`.
- `notifier_tests.ts` (`assert.async(4)`)
- `surveytimertests.ts`
- `paneltests.ts` (3 `assert.async` + 1 `QUnit.skip`)
- `surveyShowPreviewTests.ts` (`assert.async(3)`)
- `dragDropMatrixTests.ts`, `dragdropcoretests.ts` (1 `QUnit.skip`), `dragdrophelpertests.ts`
- `question_imagemap_tests.ts` (5 `assert.async`)
- `components/popuptests.ts` (6 `assert.async`)
- `components/actionbartests.ts`, `components/liststests.ts`
- `mask/*` (8 files)
- `expressions/*` (4 files)
- `icons/*`
- `responsivityTests.ts`, `headerTests.ts`, `layout_tests.ts`, `inputPerPageTests.ts`, `listModelTests.ts`, `dropdown_list_model_test.ts`, `dropdown_multi_select_list_model_test.ts`, `multi_select_list_model_tests.ts`, `surveyTOCTests.ts`, `surveyStateTests.ts`, `surveyServiceRemovingTests.ts`, `surveySeparateLocalesTests.ts`, `surveyserializationtests.ts`, `surveyquestiontests.ts`, `surveyvalidatortests.ts`, `surveytriggertests.ts` (1 `QUnit.skip`), `surveywidthmodetests.ts`, `surveyWindowTests.ts`, `choicesRestfultests.ts`, `surveyProgressButtonsTest.ts`.

### Slice 6 — The monster: `surveytests.ts`

- ~18,000 lines, 5 `assert.async` calls. Convert last, in a dedicated PR. Consider splitting it into thematic files first (separate refactor) before converting, but that's optional.

### Slice 7 — Decommission Karma

- Once `tests/entries/test.ts` is empty (or only contains `import` side-effects), delete it together with `karma.conf.js`, `rollup.tests.config.mjs`, `tsconfig.tests.json` (or repoint), `test-watch.mjs`.
- Remove devDependencies: `karma`, `karma-chrome-launcher`, `karma-junit-reporter`, `karma-qunit`, `qunit`, `@types/qunit`.
- Replace `"test"` script with `"vitest run"`.
- Update `.github/copilot-instructions.md` test-running section.

## 4. Risks and regressions to watch for

| Risk | Mitigation |
|---|---|
| **Test isolation difference.** Karma runs all tests in one browser page; Vitest workers isolate per file. Hidden cross-file dependencies (e.g., `Serializer.addClass` in file A consumed by file B's test) will surface as failures only after conversion. | When a converted file fails, check whether un-converted files set up state it depended on. Move `Serializer.addClass` calls into `tests/vitest.setup.ts` or duplicate them. |
| **`assert.equal` is `==`, `expect().toBe` is `Object.is`.** Comparisons like `assert.equal(survey.getValue("q1"), "5")` (number vs string) will start failing. | During each conversion, scan for cross-type comparisons; either use `toEqual`, coerce, or fix the test. |
| **`assert.async()` semantics.** A QUnit test with `done = assert.async()` must call `done()` or it times out. Translating to `await new Promise(r => ...)` requires identifying every `done()` call site. | Manual conversion only. Flag any test where `done()` is called from inside callbacks that may not always fire. |
| **DOM environment.** `jsdom` doesn't implement everything Karma+real-Chrome does (e.g., `IntersectionObserver`, `ResizeObserver`, `HTMLCanvasElement.getContext`, layout sizes). | Use `happy-dom` if jsdom gaps appear; mock unsupported APIs in `vitest.setup.ts`. |
| **Animation/timing.** `settings.animationEnabled = false` already mitigates most. Watch for `setTimeout`-based code; consider `vi.useFakeTimers()` per test. | Don't enable fake timers globally — opt in per converted test only when needed. |
| **Module side effects on import.** Top-level `Serializer.addClass`/`registerElement` calls run once per Vitest worker; they may collide if the same type is registered twice. | Verify converted files run cleanly in isolation: `npx vitest run path/to/file.ts`. |
| **Localization imports.** `tests/entries/test.ts` imports `russian/french/finnish/german` locales. If a converted test asserts on a localized string, the locale must be loaded via `vitest.setup.ts`. | Replicate the four locale imports in setup. |
| **`@types/qunit` removal too early.** Removing it before Slice 7 breaks un-converted files. | Keep it until the very end. |
| **Coverage parity.** Vitest's v8 coverage may report differently than Karma's (none today). | Out of scope; not a regression. |
| **CI pipelines.** `azure-pipelines/master/` likely calls `npm run test`. | Add a parallel Vitest job during migration; swap once green. |

## 5. Validation strategy and commands (survey-core only)

Per slice, in order:

```powershell
# From repo root, scope to survey-core
cd packages/survey-core

# 1. Lint the converted file
npm run lint -- tests/<file>.ts

# 2. Run the converted file in isolation (Vitest)
npx vitest run tests/<file>.ts

# 3. Run all currently-converted Vitest files
npm run test:vitest

# 4. Run remaining Karma suite to verify nothing un-converted broke
npm run test
```

CI gate per slice: both Vitest (converted) and Karma (remainder) must be green. After Slice 7, only:

```powershell
cd packages/survey-core
npm run test         # now Vitest
npm run test:vitest  # alias, optional
```

UI packages remain untouched; their `playwright.config.ts` runs are unaffected.

## 6. Rollback strategy

- **Per-slice rollback:** Each slice is a single commit (or small commit chain). If a slice breaks Karma or Vitest:

  ```powershell
  git revert <commit-sha>
  ```

  Karma resumes loading the file via the un-touched `tests/entries/test.ts` line.
- **Slice 0 rollback:** Removing the new devDependencies and config files leaves the QUnit/Karma setup fully intact (no production code touched).
- **Slice 7 rollback (decommission):** Most risk concentrated here. Tag the last "dual-runner green" commit before this slice; if decommission breaks CI, hard-reset the deletion commit and reinstate Karma scripts.
- **Production code:** prompt 2 forbids production-code changes. If a slice nevertheless touches production code (per "minimal, justified adjustment"), call it out in the PR — those changes must be revertible independently of test conversions.

## Codemod vs manual

| Pattern | Codemod-friendly? |
|---|---|
| `QUnit.module(...)` → `describe(...)` wrapper | ✅ Yes — single mechanical wrap per file. |
| `QUnit.test(name, function(assert){...})` → `test(name, () => {...})` | ✅ Yes — rename + drop `assert` param. |
| `QUnit.skip` → `test.skip` | ✅ Yes. |
| `assert.equal/deepEqual/ok/notOk/strictEqual/notEqual` → `expect().toBe/toEqual/toBeTruthy/toBeFalsy/not.toBe` | ⚠️ Mostly — but `assert.equal` strictness change requires per-call audit. Recommend codemod + manual review pass. |
| `assert.throws(fn, errArg, msg)` → `expect(fn).toThrow(...)` | ⚠️ Manual — `errArg` shape varies (Error instance, regex, string, constructor). |
| `assert.async()` | ❌ Manual — control flow rewrite. |
| Removing `export default QUnit.module(...)` and updating `entries/test.ts` | ✅ Yes — line-level removal. |

Recommended: write a small jscodeshift/ts-morph script for the synchronous mappings (saves ~70% of edit volume on Slices 2–4); use prompt 2 for the remaining manual judgment calls (Slices 1, async-heavy parts of 3, and all of Slice 5–6).

## Final definition of done (survey-core unit tests)

1. Zero `QUnit.*` or `assert.*` references in `packages/survey-core/tests/` (verify: `grep -rE "QUnit\.|assert\." tests/` returns nothing).
2. `tests/entries/test.ts`, `karma.conf.js`, `rollup.tests.config.mjs`, `tsconfig.tests.json`, `test-watch.mjs` removed (or repurposed).
3. `package.json` `"test"` script invokes Vitest; `karma*` and `qunit*` removed from devDependencies.
4. `npm run test` from `packages/survey-core` exits 0.
5. Test count parity: total Vitest test count ≥ original QUnit count (skipped tests preserved as `test.skip`).
6. CI pipeline updated and green.
7. UI package test runs (`survey-react-ui`, `survey-angular-ui`, `survey-vue3-ui`, `survey-js-ui`) unchanged and green — proves no production code regression from any "minimal adjustment" along the way.
8. `.github/copilot-instructions.md` updated to document the Vitest command.

## Status log

| Slice | File | Status |
|---|---|---|
| 1 | `tests/bindablePropertiesTests.ts` | ✅ Converted (pending barrel removal + Slice 0 infra to actually run) |
| 0 | Vitest infra | ⏳ Not started |
