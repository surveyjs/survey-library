# survey-core

[![Build Status](https://dev.azure.com/SurveyJS/V2%20Libraries/_apis/build/status%2Flibrary%2FLibrary%20Main?repoName=surveyjs%2Fsurvey-library&branchName=master)](https://dev.azure.com/SurveyJS/V2%20Libraries/_build/latest?definitionId=130&repoName=surveyjs%2Fsurvey-library&branchName=master)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/surveyjs/survey-library/blob/master/LICENSE)
[![Tested with Playwright](https://img.shields.io/badge/tested%20with-Playwright-2fa4cf.svg)](https://playwright.dev)
[![Open Issues](https://img.shields.io/github/issues/surveyjs/survey-library.svg)](https://github.com/surveyjs/survey-library/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/surveyjs/survey-library.svg)](https://github.com/surveyjs/survey-library/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+)

`survey-core` is the platform-independent model of the [SurveyJS Form Library](https://surveyjs.io/form-library). It holds everything that does not depend on a rendering framework: the JSON schema and serializer, question types, validation, conditional logic and expressions, localization, input masks, and themes. **It does not render anything on its own** — pair it with one of the [platform-specific UI packages](#related-packages) below. Installing `survey-core` alone is the most common reason a survey never appears on the page.

[![SurveyJS Form Library themes](https://raw.githubusercontent.com/surveyjs/survey-library/master/docs/images/survey-library-themes.png)](https://surveyjs.io/form-library/examples/)

## Install

Install the UI package for your framework — `survey-core` comes with it as a dependency:

```sh
npm install survey-react-ui   # React
npm install survey-angular-ui # Angular
npm install survey-vue3-ui    # Vue 3
npm install survey-js-ui      # HTML/CSS/JavaScript
```

To add the model on its own (for example, in code shared between a UI layer and a Node.js service):

```sh
npm install survey-core
```

## Usage

```js
import { Model } from "survey-core";
import "survey-core/survey-core.css";

const surveyJson = {
  elements: [
    { name: "firstName", title: "Enter your first name:", type: "text" },
    { name: "satisfaction", title: "How satisfied are you?", type: "rating" }
  ]
};

const survey = new Model(surveyJson);
survey.onComplete.add((sender) => {
  console.log(JSON.stringify(sender.data, null, 2));
});
```

Pass the `survey` instance to the component from your UI package to render it — for example, `<Survey model={survey} />` in React. See the Get Started tutorial for your framework in the table below.

`survey-core/survey-core.css` applies the Default theme; `survey-core/survey-core.min.css` is the minified build. Other predefined themes are imported from `survey-core/themes` — refer to [Themes & Styles](https://surveyjs.io/form-library/documentation/manage-default-themes-and-styles).

## Theme adapters

Themes are built on `--sjs-*` CSS custom properties (design tokens). A *theme adapter* maps an existing design system's variables onto those tokens, so an embedded survey inherits the look of the host application instead of being restyled by hand. Adapters ship with `survey-core` as plain CSS — import one after the base style sheet:

```js
import "survey-core/survey-core.css";
import "survey-core/themes/adapters/bootstrap-default.css";
```

Adapters are available for [Bootstrap](https://getbootstrap.com), [Material UI](https://mui.com) (`mui.css`), and [shadcn/ui](https://ui.shadcn.com) (`shadcn-default.css`, `shadcn-new-york.css`). Bootstrap additionally ships [Bootswatch](https://bootswatch.com) variants — `bootstrap-darkly.css`, `bootstrap-flatly.css`, and others. Because adapters read the host system's live variables, any Bootstrap or Bootswatch build re-skins the survey automatically. Matching icon sets are optional side-effect imports:

```js
import "survey-core/themes/adapters/icons/lucide"; // or ".../icons/mui"
```

Adapters are framework-independent and require no extra markup or configuration. See [Theme Adapters](https://surveyjs.io/themes/theme-adapters).

## Use on the server (Node.js)

`survey-core` has no DOM dependency and imports cleanly in Node (both `require` and ESM `import`), so the same model that renders in the browser can run on the server. Use it to re-validate a submitted response, evaluate conditional logic, or inspect and transform a survey JSON definition — no UI package and no CSS import required.

```js
const { Model } = require("survey-core");

const survey = new Model(surveyJson);
survey.data = submittedAnswers;

if (!survey.validate(true, false)) {
  const errors = survey.getAllQuestions()
    .filter((q) => q.errors.length > 0)
    .map((q) => ({ question: q.name, messages: q.errors.map((e) => e.getText()) }));
  // Reject the submission and return `errors` to the client.
}
```

Client-side validation can always be bypassed, so re-running it on the server with the same schema is the point: `isRequired`, `validators`, and `visibleIf` behave identically in both places. `survey.getPlainData()` gives a flat, display-ready view of the answers for storage, export, or reporting, and `Serializer` lets you inspect or modify the JSON definition programmatically.

To get validation messages in a specific locale, load it and set `locale`:

```js
require("survey-core/i18n/french");
survey.locale = "fr";
```

### Server-side rendering (SSR)

The same DOM-free design makes SSR work: a survey can be pre-rendered on the server with [`survey-react-ui`](https://www.npmjs.com/package/survey-react-ui) and hydrated on the client. HTML `id` attributes are generated deterministically per survey instance, so the server and client produce matching markup. If you render multiple surveys on one page, assign a unique [`elementIdPrefix`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#elementIdPrefix) to each model so their `id` attributes don't collide.

## Related packages

| Framework | UI package | Get Started |
| --- | --- | --- |
| React | [`survey-react-ui`](https://www.npmjs.com/package/survey-react-ui) | [Tutorial](https://surveyjs.io/form-library/documentation/get-started-react) |
| Angular | [`survey-angular-ui`](https://www.npmjs.com/package/survey-angular-ui) | [Tutorial](https://surveyjs.io/form-library/documentation/get-started-angular) |
| Vue 3 | [`survey-vue3-ui`](https://www.npmjs.com/package/survey-vue3-ui) | [Tutorial](https://surveyjs.io/form-library/documentation/get-started-vue) |
| HTML/CSS/JavaScript | [`survey-js-ui`](https://www.npmjs.com/package/survey-js-ui) | [Tutorial](https://surveyjs.io/form-library/documentation/get-started-html-css-javascript) |

## Documentation

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/form-library/documentation/overview)
- [Live Examples](https://surveyjs.io/form-library/examples/)
- [What's New](https://surveyjs.io/WhatsNew)

For AI coding agents: [https://surveyjs.io/llms.txt](https://surveyjs.io/llms.txt) indexes the documentation. Any documentation page is also available as raw Markdown — append `.md` to its URL, for example [https://surveyjs.io/form-library/documentation/get-started-react.md](https://surveyjs.io/form-library/documentation/get-started-react.md).

## SurveyJS ecosystem

| Product | Purpose | License |
| --- | --- | --- |
| [Form Library](https://surveyjs.io/form-library) | Render dynamic forms from JSON (this package) | MIT |
| [Survey Creator](https://surveyjs.io/survey-creator) | Drag-and-drop form builder UI | Commercial |
| [Dashboard](https://surveyjs.io/dashboard) | Visualize and analyze collected results | Commercial |
| [PDF Generator](https://surveyjs.io/pdf-generator) | Render forms and responses as PDF | Commercial |
| [AI Form Response Extractor](https://surveyjs.io/documentation/combine-paper-and-online-survey-form-data) | Extract responses from paper forms, PDFs, and images into a SurveyJS schema (`ai-form-response-extractor`) | MIT |

## Build from sources

This monorepo does **not** use npm workspaces — each package installs and builds independently, but a root install is still required for the shared tooling (linting, Playwright).

1. **Clone the repo and install shared dependencies**

    ```sh
    git clone https://github.com/surveyjs/survey-library.git
    cd survey-library
    npm install
    ```

    Requires Node.js 20 or later — CI builds on Node 20.x and 22.x.

2. **Install and build `survey-core`**

    ```sh
    cd packages/survey-core
    npm install
    npm run build:all
    ```

    Build output goes to the `build` directory. `npm run build` produces the JS bundle alone; `npm run build:all` adds i18n, themes, icons, and adapters. Use `npm run watch:dev` while developing.

    Every UI package resolves `survey-core` from `../survey-core/build`, so **survey-core must be built before you build or test any UI package.**

3. **Run unit tests**

    Unit tests use [Vitest](https://vitest.dev/) in a jsdom environment and live in `packages/survey-core/tests`.

    ```sh
    npm run test                          # whole suite
    npm run test:watch                    # watch mode
    npx vitest run tests/surveytests.ts   # a single file
    npx vitest run -t "visibleIf"         # tests whose name matches a substring
    ```

4. **Run end-to-end tests**

    E2E, visual-regression, and accessibility tests are Playwright suites shared by all UI packages and run from a UI package directory (after `survey-core` is built). Angular and Vue 3 additionally need their example app built first (`npm run build:example:prod`). Do not start an HTTP server yourself — the Playwright config starts its own.

    ```sh
    cd packages/survey-react-ui
    npm install
    npm run e2e:ci                        # e2e
    npm run e2e:ci -- --grep "TestName"   # a single test
    npm run scr:ci                        # visual regression
    npm run accessibility-tests:ci        # accessibility
    ```

5. **Build a UI package**

    - [Angular Form Library](https://github.com/surveyjs/survey-library/blob/master/packages/survey-angular-ui/README.md#build-surveyjs-angular-form-library-from-sources)
    - [React Form Library](https://github.com/surveyjs/survey-library/blob/master/packages/survey-react-ui/README.md#build-surveyjs-react-form-library-from-sources)
    - [Vue Form Library](https://github.com/surveyjs/survey-library/blob/master/packages/survey-vue3-ui/README.md#build-surveyjs-vue-form-library-from-sources)
    - [HTML/CSS/JS Form Library](https://github.com/surveyjs/survey-library/blob/master/packages/survey-js-ui/README.md#build-surveyjs-form-library-ui-from-sources)

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
