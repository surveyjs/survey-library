# Copilot Instructions for survey-library

## Running Tests

### Unit Tests — `packages/survey-core`
- **Command:** `npm run test`
- **Framework:** Vitest + jsdom
- **Working directory:** `packages/survey-core`
- **Watch mode:** `npm run test:watch`
- **Single file:** `npx vitest run tests/<file>.ts`
- **Single test:** `npx vitest run -t "test name substring"`

### Playwright E2E Tests — All UI Packages
Each UI package uses Playwright with the root `playwright.config.ts`. The `e2e:ci` script sets the correct `env` variable automatically via `cross-env`.

| Package | Command | Working Directory | Env Variable |
|---|---|---|---|
| survey-react-ui | `npm run e2e:ci` | `packages/survey-react-ui` | `env=react` |
| survey-angular-ui | `npm run e2e:ci` | `packages/survey-angular-ui` | `env=angular` |
| survey-vue3-ui | `npm run e2e:ci` | `packages/survey-vue3-ui` | `env=vue3` |
| survey-js-ui | `npm run e2e:ci` | `packages/survey-js-ui` | `env=survey-js-ui` |

### Other Test Types Available in UI Packages
- **VRT (visual regression):** `npm run scr:ci`
- **Accessibility:** `npm run accessibility-tests:ci`
- **Interactive UI mode:** Replace `:ci` with nothing (e.g., `npm run e2e`, `npm run scr`)

### Prerequisites
- **Build survey-core first** before running UI package tests: `cd packages/survey-core && npm run build`
- **Do NOT pre-start http-server manually.** Each package has its own `playwright.config.ts` that overrides the root config's empty `webServer.command`:
  - `survey-react-ui` and `survey-js-ui` use `npx http-server --silent`
  - `survey-angular-ui` and `survey-vue3-ui` use `npm run serve:example:prod`
  Playwright starts and stops the server automatically. Pre-starting http-server causes a "port already in use" error.
- **Angular and Vue3 require building example apps** before e2e tests:
  - `cd packages/survey-angular-ui && npm run build:example:prod` (builds `example/dist`)
  - `cd packages/survey-vue3-ui && npm run build:example:prod` (builds `example/dist`)
  React and JS-UI serve static files and don't need a separate build step.
- `node_modules/survey-core` in UI packages is a Junction symlink to `packages/survey-core/build`

### Running a Single Test
- **Vitest (survey-core):** `npx vitest run -t "TestName"` or `npx vitest run tests/specificfile.ts`
- **Playwright (UI packages):** `npm run e2e:ci -- --grep "TestName"` or use `--project e2e` with specific test files

### Playwright Config Structure
The root `playwright.config.ts` defines three projects:
- `e2e` → test dir: `./e2e`
- `vrt` → test dir: `./screenshots`
- `a11y` → test dir: `./accessibilityTests`

### Token-Saving Tips for AI Agents
- **Vitest output is concise** — only prints failed assertions and a summary line. Safe to run synchronously.
- **Playwright output is manageable** — Shows progress like `[X/450]` and only prints full details for failures.
- **Don't run all packages' tests at once** — Run one package at a time to keep output and context manageable.
