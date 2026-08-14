<div align="center">

<img width="1200" height="600" alt="readme_overview_library" src="https://github.com/user-attachments/assets/1380d69c-9005-400e-aefd-ef6842d72744" />
  
# SurveyJS React Form Library

[![Build Status](https://dev.azure.com/SurveyJS/V2%20Libraries/_apis/build/status%2Flibrary%2FLibrary%20Main?repoName=surveyjs%2Fsurvey-library&branchName=master)](https://dev.azure.com/SurveyJS/V2%20Libraries/_build/latest?definitionId=130&repoName=surveyjs%2Fsurvey-library&branchName=master)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/surveyjs/survey-library/blob/master/LICENSE)
[![Tested with Playwright](https://img.shields.io/badge/tested%20with-Playwright-2fa4cf.svg)](https://playwright.dev)
[![Open Issues](https://img.shields.io/github/issues/surveyjs/survey-library.svg)](https://github.com/surveyjs/survey-library/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/surveyjs/survey-library.svg)](https://github.com/surveyjs/survey-library/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+)

</div>
<div align="justify">

SurveyJS React Form Library is a free and open-source React component library for rendering dynamic, JSON-driven forms and surveys in React applications.

The `survey-react-ui` package integrates SurveyJS Form Library with React, renders forms defined with SurveyJS JSON form definitions, and collects user responses in the browser. It works together with the framework-independent [`survey-core`](https://github.com/surveyjs/survey-library/tree/master/packages/survey-core) package, which provides the form model and handles form structure, validation, conditional logic, calculations, navigation, localization, and other core behavior. Installing `survey-react-ui` brings `survey-core` with it — you build a model from JSON with `survey-core` and bind it to this package's `<survey>` component to display.

Use SurveyJS React Form Library to build multi-step forms, surveys, quizzes, assessments, calculator forms, and other data-entry tools. Form definitions and submitted responses can be stored and processed in your own backend and database.

You can create form definitions manually, generate them with AI, or build them visually with [SurveyJS Creator](https://surveyjs.io/survey-creator/documentation/overview), an embeddable drag-and-drop form builder.

## Installation

```sh
npm install survey-react-ui
```

## Usage

```jsx
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.css";

const surveyJson = {
  elements: [
    { name: "firstName", title: "Enter your first name:", type: "text" },
    { name: "satisfaction", title: "How satisfied are you?", type: "rating" }
  ]
};

export default function SurveyComponent() {
  const survey = new Model(surveyJson);
  survey.onComplete.add((sender) => {
    console.log(JSON.stringify(sender.data, null, 2));
  });

  return <Survey model={survey} />;
}
```

`survey-core/survey-core.css` applies the Default theme. For other predefined themes and CSS-variable customization, refer to [Themes & Styles](https://surveyjs.io/form-library/documentation/manage-default-themes-and-styles).

## Server-Side Rendering

SurveyJS supports SSR: `survey-core` does not access the DOM during rendering, and HTML `id` attributes are generated deterministically per survey instance, so server and client markup match and hydration succeeds. If you render multiple surveys on the same page, assign a unique [`elementIdPrefix`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#elementIdPrefix) to each model.

Under [Next.js](https://nextjs.org) or another framework with React Server Components, mark the component that renders a survey as client code with the ['use client'](https://react.dev/reference/react/use-client) directive — SurveyJS components are interactive and rely on state and event handlers. See [Add a Survey to a React Application](https://surveyjs.io/form-library/documentation/get-started-react).

## Theme Adapters

A theme adapter maps an existing design system's CSS variables onto SurveyJS design tokens, so an embedded survey inherits the look of the host application. Adapters ship with `survey-core` as plain CSS — import one after the base style sheet:

```js
import "survey-core/survey-core.css";
import "survey-core/themes/adapters/shadcn-default.css";
```

Adapters are available for [Bootstrap](https://getbootstrap.com) (plus Bootswatch variants), [Material UI](https://mui.com), and [shadcn/ui](https://ui.shadcn.com), with matching icon sets (`survey-core/themes/adapters/icons/lucide`, `.../icons/mui`). See [Theme Adapters](https://surveyjs.io/themes/theme-adapters).

## Key Features

### Dynamic Forms and Surveys

- Render dynamic JSON-driven forms and surveys in React applications
- Multi-step forms, quizzes, assessments, calculator forms, and survey pop-ups
- Conditional visibility, branching, calculations, and expression-based logic
- Input validation, [save-and-resume workflows](https://surveyjs.io/form-library/examples/save-and-restore-user-responses-to-complete-survey/reactjs), and dynamic content

### Form Controls

- 20+ built-in question and input types
- Dynamic panels and repeating question groups
- [Custom question types](https://surveyjs.io/form-library/documentation/customize-question-types/question-customization-options) and reusable components
- Electronic signature, image capture, file upload, matrices, and other advanced controls

### React Integration

- React components
- TypeScript support
- Framework-independent form model through `survey-core`
- Client-side rendering without a required SurveyJS backend
- Support for SSR

### Data and Backend Integration

- [Connect to any server, API, or database](https://surveyjs.io/documentation/backend-integration)
- Store form definitions and submitted responses in your own infrastructure
- [Load choices from web services](https://surveyjs.io/form-library/examples/dropdown-menu-load-data-from-restful-service/reactjs)
- Integrate third-party components and services
- [Backend integration examples for PHP, ASP.NET Core, and Node.js](https://surveyjs.io/backend-integration/examples)

### Appearance and Localization

- Built-in themes and custom branding
- [Theme Adapters for Bootstrap, Material UI, and shadcn/ui](https://surveyjs.io/themes/theme-adapters)
- Multi-language forms and right-to-left language support
- Community-supported UI localization

## Related packages

| Package | Purpose |
| --- | --- |
| [`survey-core`](https://www.npmjs.com/package/survey-core) | Platform-independent survey model (installed automatically) |
| [`survey-angular-ui`](https://www.npmjs.com/package/survey-angular-ui) | Angular renderer |
| [`survey-vue3-ui`](https://www.npmjs.com/package/survey-vue3-ui) | Vue 3 renderer |
| [`survey-js-ui`](https://www.npmjs.com/package/survey-js-ui) | HTML/CSS/JavaScript renderer |

## Documentation

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/form-library/documentation/overview)
- [Get Started with React](https://surveyjs.io/form-library/documentation/get-started-react)
- [Form Library Demos for React](https://surveyjs.io/form-library/examples/nps-question/reactjs)
- [Release Notes](https://surveyjs.io/stay-updated/release-notes)
- [Roadmap](https://surveyjs.io/stay-updated/roadmap)
- [What's New](https://surveyjs.io/stay-updated/major-updates/2025-2026)

For AI coding agents: [https://surveyjs.io/llms.txt](https://surveyjs.io/llms.txt) indexes the documentation. Any documentation page is also available as raw Markdown — append `.md` to its URL, for example [https://surveyjs.io/form-library/documentation/get-started-react.md](https://surveyjs.io/form-library/documentation/get-started-react.md).

## SurveyJS Ecosystem

| Product | Purpose | License |
| --- | --- | --- |
| [Form Library](https://surveyjs.io/form-library) | Render dynamic forms from JSON (this package) | MIT |
| [Survey Creator](https://surveyjs.io/survey-creator) | Drag-and-drop form builder UI | Commercial |
| [Dashboard](https://surveyjs.io/dashboard) | Visualize and analyze collected results | Commercial |
| [PDF Generator](https://surveyjs.io/pdf-generator) | Render forms and responses as PDF | Commercial |
| [AI Form Response Extractor](https://surveyjs.io/documentation/combine-paper-and-online-survey-form-data) | Extract responses from paper forms, PDFs, and images into a SurveyJS schema (`ai-form-response-extractor`) | MIT |

## Build from Source

Requires Node.js 20 or later — CI builds on Node 20.x and 22.x. This monorepo does **not** use npm workspaces: each package installs independently, but a root install is still required for the shared tooling (linting, Playwright).

1. **Clone the repo and install shared dependencies**

    ```sh
    git clone https://github.com/surveyjs/survey-library.git
    cd survey-library
    npm install
    ```

2. **Build `survey-core` first**

    This package resolves `survey-core` from `../survey-core/build`, so the model must be built before this library can be built or tested. Follow [Build from sources](https://github.com/surveyjs/survey-library/blob/master/packages/survey-core/README.md#build-from-sources) in the `survey-core` README.

3. **Install dependencies and build this library**

    ```sh
    cd packages/survey-react-ui
    npm install
    npm run build
    ```

    Build output goes to the `build` directory. Use `npm run watch:dev` while developing.

4. **Run a test application**

    ```sh
    npm run start
    ```

    This serves the package directory at http://localhost:8080/.

5. **Run unit tests**

    Unit tests use [Vitest](https://vitest.dev/) in a jsdom environment and live in `tests`. The markup snapshot tests are generated into `tests/shards` by `gen-shards.js` before each run, so `npm run test` is the entry point rather than a bare `vitest`.

    ```sh
    npm run test                             # whole suite
    npm run test:watch                       # watch mode
    npx vitest run tests/ssr-postid.spec.ts  # a single file
    npx vitest run -t "test name"            # tests matching a substring
    npm run test:update                      # update markup snapshots
    ```

6. **Run end-to-end tests**

    E2E, visual-regression, and accessibility tests are Playwright suites. Do not start an HTTP server yourself — the Playwright config starts its own.

    ```sh
    npm run e2e:ci                          # e2e
    npm run e2e:ci -- --grep "TestName"     # a single test
    npm run scr:ci                          # visual regression
    npm run accessibility-tests:ci          # accessibility
    ```

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
