# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo (npm workspaces are *not* used — each package installs and builds independently). The packages under `packages/` are:

- **survey-core** — the platform-independent survey model. All business logic, serialization, validation, expressions, localization, theming, and SCSS styles live here. The UI packages are thin rendering layers on top of it.
- **survey-react-ui** — React 17 renderer (`.tsx`, built with Rollup).
- **survey-vue3-ui** — Vue 3 renderer (`.vue`, built with Vite).
- **survey-angular-ui** — Angular 12 renderer (built with ng-packagr).
- **survey-js-ui** — framework-free HTML/CSS/JS renderer (built with Rollup). jQuery support is a wrapper over this.

Each UI package depends on `survey-core` via the path `../survey-core/build`. In a UI package, `node_modules/survey-core` is a **Junction symlink to `packages/survey-core/build`**, so **survey-core must be built before any UI package can build or run its tests.**

## Build

```bash
# survey-core (run from packages/survey-core) — REQUIRED before building/testing any UI package
npm run build          # main JS bundle + non-source files
npm run build:all      # build + i18n + themes + icons

# UI packages (run from the package dir)
npm run build          # react / js-ui / angular (ng build) / vue3 (vite)
```

Styles are authored in SCSS under `packages/survey-core/src/default-theme/` and compiled into the survey-core build. Question/element factories and the JSON serializer are populated by import side effects, so bundle entry points (`packages/survey-core/entries/`) matter — `entries/index.ts` is the public API surface.

## Lint

```bash
npm run lint           # eslint, --max-warnings=0 (root or any package)
npm run lint:fix
```

ESLint is enforced with zero warnings. `lint-staged` runs `eslint --fix` on commit, and commit messages must follow Conventional Commits (`@commitlint/config-conventional`).

## Tests

### Unit tests — survey-core (Vitest + jsdom)
Run from `packages/survey-core`:

```bash
npm run test                      # all unit tests (vitest run)
npm run test:watch
npx vitest run tests/<file>.ts    # single file
npx vitest run -t "test name"     # single test by name substring
```

The UI packages also have Vitest unit/markup tests (`npm run test`); React markup snapshots are updated with `npm run test:update`.

### E2E / VRT / a11y — UI packages (Playwright)
The **root `playwright.config.ts`** defines three projects shared by all UI packages: `e2e` (`./e2e`), `vrt` (`./screenshots`), `a11y` (`./accessibilityTests`). Each UI package's own `playwright.config.ts` sets the correct `webServer` and an `env` variable (`react` / `vue3` / `angular` / `survey-js-ui`) selecting which framework to test. Run from the package dir:

```bash
npm run e2e:ci                    # e2e (cross-env sets env=<framework>)
npm run scr:ci                    # visual regression
npm run accessibility-tests:ci    # axe-based a11y
# single e2e test:
npm run e2e:ci -- --grep "TestName"
# drop the :ci suffix (npm run e2e / scr) to open Playwright's interactive UI
```

Prerequisites for Playwright runs (see `.github/copilot-instructions.md` for the full table):
- Build `survey-core` first.
- **Do NOT manually start an http-server** — each package's Playwright config starts/stops its own server (`http-server` for react/js-ui; `serve:example:prod` for angular/vue3). Pre-starting causes "port already in use".
- **Angular and Vue3 require building the example app first**: `npm run build:example:prod` (produces `example/dist`). React and js-ui serve static files and need no example build.
- Run one package's tests at a time to keep output manageable.

`npm run pre-push-check` (the husky pre-push hook) runs survey-core unit tests.

## Architecture

### Serialization metadata system (the backbone)
SurveyJS is JSON-driven: a survey is defined by a JSON schema and serialized back to JSON. This is powered by a custom reflection/metadata layer in `packages/survey-core/src/jsonobject.ts`:

- `Serializer` (the `JsonMetadata` singleton) holds the registry of every serializable class and its properties.
- Classes register themselves and their properties via `Serializer.addClass(name, properties, creator, parentName)`, typically in a static block at the bottom of each class file (e.g. `question_text.ts`). Properties declare type, default, `isLocalizable`, `visibleIf`, `dependsOn`, etc.
- `Base` (`src/base.ts`) is the root class for all serializable model objects. It stores property values in a hash, fires `onPropertyChanged`, and integrates with the reactivity bridge. Property getters/setters call `getPropertyValue` / `setPropertyValue`.

When adding or changing a question property, you almost always touch both the TypeScript getter/setter **and** the `Serializer.addClass`/`addProperty` registration, plus localization strings if it's user-facing.

### Model class hierarchy (survey-core)
`Base` → `SurveyElement` (`survey-element.ts`) → `Question` (`question.ts`) and `PanelModelBase`/`PanelModel`/`PageModel` (`panel.ts`, `page.ts`). `SurveyModel` (`survey.ts`) is the top-level container. Concrete question types live in `question_*.ts` (e.g. `question_text.ts`, `question_checkbox.ts`, `question_matrixdynamic.ts`, `question_paneldynamic.ts`) and register with `QuestionFactory` / `ElementFactory` (`questionfactory.ts`) so they can be created from a JSON `type`.

### Other core subsystems
- **Expressions** (`src/expressions/`, `src/conditions/`) — `visibleIf`/`enableIf`/`requiredIf`, triggers, calculated values, and the custom function library (`functionsfactory.ts`). The grammar is generated from a PEG file via `peggy`.
- **Localization** (`src/localization/`, `src/surveyStrings.ts`, `localizablestring.ts`) — every user-facing string is a `LocalizableString` that resolves per-locale and supports text piping/preprocessing (`textPreProcessor.ts`).
- **Input masks** (`src/mask/`) — pattern/numeric/currency/datetime masks with their own lexer/parser.
- **Drag & drop** (`src/dragdrop/`), **actions/list/popup UI primitives** (`src/actions/`, `list.ts`, `popup*.ts`), and **theming** (`src/themes.ts`, `src/default-theme/`).

### Reactivity bridge (core ↔ UI)
survey-core is framework-agnostic and exposes its own change-notification system rather than depending on any framework's reactivity. Each UI package adapts it:

- React (`reactquestion_element.tsx`): `SurveyElementBase` calls `makeBaseElementsReact()` / `unMakeBaseElementsReact()` to subscribe to model `onPropertyChanged` events and trigger `forceUpdate`. Question components are resolved through `ReactQuestionFactory` / `ReactElementFactory`; localizable strings render via `renderLocString`.
- Vue/Angular wrap the same model events into their respective reactivity systems.

So a typical UI rendering component is a paper-thin view over a survey-core model object: it reads computed properties (CSS classes, visibility, value) off the model and re-renders when the model notifies a change. New behavior generally belongs in survey-core; the UI layer only renders it.
