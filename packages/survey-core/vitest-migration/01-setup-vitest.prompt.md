---
description: "Set up Vitest infrastructure for survey-core"
name: "Survey-core Vitest — Infrastructure Setup"
agent: "agent"
---
Set up the Vitest test runner alongside the existing Karma+QUnit setup in `packages/survey-core` so that converted test files can actually run. **Do not convert any test files in this prompt.** Karma+QUnit must remain fully operational at the end.

Scope constraints:
- Touch only files inside `packages/survey-core/`.
- Do not modify UI packages.
- Do not modify production source under `packages/survey-core/src/`.
- Do not delete or rename Karma/QUnit config files.

Required actions:

1. **Add devDependencies** to `packages/survey-core/package.json`:
   - `vitest` (latest stable)
   - `jsdom`
   - `@vitest/coverage-v8` (optional, only if coverage is desired)
   - Do **not** remove `karma`, `karma-*`, `qunit`, `@types/qunit`.

2. **Create `packages/survey-core/vitest.config.ts`** with:
   - `test.environment: "jsdom"`
   - `test.globals: false` (force explicit imports from `vitest`)
   - `test.setupFiles: ["./tests/vitest.setup.ts"]`
   - **Dynamic `test.include`** — do NOT use a static glob like `tests/**/*.ts`. The Karma barrel still loads un-converted QUnit files; if Vitest also globs them, every QUnit file fails with `ReferenceError: QUnit is not defined`. Instead, enumerate `tests/**/*.ts` with `fast-glob` at config-load time and filter to files whose source contains `from "vitest"`:
     ```ts
     import fg from "fast-glob";
     import fs from "node:fs";
     import path from "node:path";
     const allTestFiles = fg.sync("tests/**/*.ts", {
       cwd: __dirname,
       ignore: ["tests/entries/**", "tests/bundle/**", "node_modules/**", "build/**"],
     });
     const vitestFiles = allTestFiles.filter((f) =>
       /from\s+["']vitest["']/.test(fs.readFileSync(path.resolve(__dirname, f), "utf8"))
     );
     // use vitestFiles in test.include
     ```
     Add `fast-glob` as a devDependency.
     **Also exclude `tests/vitest.setup.ts` from the include glob** — it imports from `vitest` (for `afterEach`) but it is the setup file, not a test file. If picked up by the include filter Vitest fails with "No test suite found in file vitest.setup.ts".
   - Path alias `survey-core` → `./entries/index.ts` (NOT `./src`). The locale files (`survey.i18n`, etc.) import `setupLocale` from the package name `survey-core`, and only the `entries/index.ts` barrel re-exports it. Pointing the alias at `./src` produces `Could not find a declaration file for module 'survey-core'` / runtime resolution failures.

3. **Create `packages/survey-core/tests/vitest.setup.ts`** that:
   - Imports the four locales currently imported at the bottom of `tests/entries/test.ts` (russian, french, finnish, german).
   - Sets `settings.animationEnabled = false` and `settings.dropdownSearchDelay = 0` (mirroring `tests/entries/test.ts`).
   - **Registers a global `afterEach` that resets every known global singleton.** Vitest runs all tests in a file sequentially in the same V8 isolate, so any singleton mutation by test N (e.g., `ComponentCollection.Instance.add(...)`, `surveyLocalization.defaultLocale = "de"`, `Serializer.addProperty(...)`) leaks into test N+1 unless explicitly cleared. The QUnit suite worked around this with trailing per-test cleanup calls, which Vitest cannot rely on (an earlier `expect()` failure skips the cleanup line). The setup file MUST contain something like:
     ```ts
     import { afterEach } from "vitest";
     import { ComponentCollection } from "../src/question_custom";
     import { surveyLocalization } from "../src/surveyStrings";
     const __defaultLocale = surveyLocalization.defaultLocale;
     afterEach(() => {
       ComponentCollection.Instance.clear(true); // include internal:true components
       surveyLocalization.defaultLocale = __defaultLocale;
       settings.animationEnabled = false;
       settings.dropdownSearchDelay = 0;
     });
     ```
   - When the migration uncovers a new singleton that needs reset, add it to this hook (one source of truth for cleanup). Do NOT add per-test cleanup calls in converted test files — the codemod strips trailing ones and the global hook handles the rest.
   - **Registers custom matchers via `expect.extend(...)`.** The codemod maps `assert.equal`/`assert.notEqual` to a `toLooseEqual` matcher (rather than strict `toBe`) so legacy QUnit comparisons like `assert.equal(undefined, null)` or `assert.equal("0", 0)` keep their original `==` semantics. The setup file MUST contain:
     ```ts
     import { expect } from "vitest";
     expect.extend({
       toLooseEqual(received: unknown, expected: unknown) {
         // eslint-disable-next-line eqeqeq
         const pass = received == expected;
         return {
           pass,
           message: () =>
             pass
               ? `expected ${this.utils.printReceived(received)} not to loosely equal ${this.utils.printExpected(expected)}`
               : `expected ${this.utils.printReceived(received)} to loosely equal ${this.utils.printExpected(expected)}`,
         };
       },
     });
     declare module "vitest" {
       interface Assertion<T = any> { toLooseEqual(expected: unknown): T; }
       interface AsymmetricMatchersContaining { toLooseEqual(expected: unknown): unknown; }
     }
     ```
   - The setup file MUST also register a `toEqualValues` matcher (mapped from `assert.deepEqual`) that ignores own non-index function-typed properties on arrays. survey-library's `Base.createNewArray` assigns `push`/`pop`/`shift`/`unshift`/`splice` as own enumerable function properties on observable arrays, which causes Vitest's `toEqual` to fail against plain array literals. Implementation:
     ```ts
     expect.extend({
       toEqualValues(received: unknown, expected: unknown) {
         const arrayValuesEqual = (a, b, customTesters) => {
           const aIsArr = Array.isArray(a), bIsArr = Array.isArray(b);
           if (!aIsArr && !bIsArr) return undefined;
           if (!aIsArr || !bIsArr) return false;
           if (a.length !== b.length) return false;
           for (let i = 0; i < a.length; i++) {
             if (!this.equals(a[i], b[i], customTesters)) return false;
           }
           return true;
         };
         const pass = this.equals(received, expected, [arrayValuesEqual]);
         return { pass, message: () => /* ... */ "" };
       },
     });
     declare module "vitest" {
       interface Assertion<T = any> { toEqualValues(expected: unknown): T; }
     }
     ```
     Implementation note: do NOT pre-normalize `received`/`expected` into deep-cloned plain objects — survey-library models contain hundreds of cyclic and observable references; cloning them OOMs jsdom. Plug into Vitest's deep-equal via the custom-tester argument instead.

4. **Add scripts** to `packages/survey-core/package.json`:
   - `"test:vitest": "vitest run"`
   - `"test:vitest:watch": "vitest"`
   - Leave the existing `"test"` (Karma) script untouched.

5. **Update `packages/survey-core/tsconfig.tests.json`** `compilerOptions.types` to include both `"qunit"` and `"vitest/globals"` (the latter is harmless when `globals: false` and helps tooling).

6. **Verify the converted pilot file runs**: `tests/bindablePropertiesTests.ts` was already converted in Slice 1. Run it via `npx vitest run tests/bindablePropertiesTests.ts` from `packages/survey-core` and report the result.

7. **Remove the converted pilot from the Karma barrel**: delete the line `export * from "../bindablePropertiesTests";` from `packages/survey-core/tests/entries/test.ts`. Verify Karma still builds: `npm run test`.

Required output:
1. Diff of every file created/modified.
2. Output (or summary) of `npx vitest run tests/bindablePropertiesTests.ts`.
3. Output (or summary) of `npm run test` (Karma) confirming it still passes.
4. Any deviations from the plan with justification.

Quality checks:
- If `jsdom` proves insufficient for the pilot file, document the issue and propose `happy-dom` as an alternative — do not silently switch.
- If npm install fails on the host machine, stop and report; do not proceed.
- Do not commit `node_modules` or lockfile changes that aren't strictly required.

Stop conditions (report and halt instead of proceeding):
- Vitest run of the pilot file fails with errors not introduced by this slice.
- Karma run breaks after the barrel edit.
