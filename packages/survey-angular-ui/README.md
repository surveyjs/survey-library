<div align="center">

<img width="1200" height="600" alt="readme_overview_library" src="https://github.com/user-attachments/assets/dfd139b5-9ca5-4cc2-886a-3650dbdbc6cd" />

# SurveyJS Angular Form Library

[![Build Status](https://dev.azure.com/SurveyJS/V2%20Libraries/_apis/build/status%2Flibrary%2FLibrary%20Main?repoName=surveyjs%2Fsurvey-library&branchName=master)](https://dev.azure.com/SurveyJS/V2%20Libraries/_build/latest?definitionId=130&repoName=surveyjs%2Fsurvey-library&branchName=master)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/surveyjs/survey-library/blob/master/LICENSE)
[![Tested with Playwright](https://img.shields.io/badge/tested%20with-Playwright-2fa4cf.svg)](https://playwright.dev)
[![Open Issues](https://img.shields.io/github/issues/surveyjs/survey-library.svg)](https://github.com/surveyjs/survey-library/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/surveyjs/survey-library.svg)](https://github.com/surveyjs/survey-library/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+)

</div>
<div align="justify">

SurveyJS Angular Form Library is a free and open-source Angular component library for rendering dynamic, JSON-driven forms and surveys in Angular applications.

The `survey-angular-ui` package integrates SurveyJS Form Library with Angular, renders forms defined with SurveyJS JSON form definitions, and collects user responses in the browser. It works together with the framework-independent [`survey-core`](https://github.com/surveyjs/survey-library/tree/master/packages/survey-core) package, which provides the form model and handles form structure, validation, conditional logic, calculations, navigation, localization, and other core behavior. Installing `survey-angular-ui` brings `survey-core` with it — you build a model from JSON with `survey-core` and bind it to this package's `<survey>` component to display.

Use SurveyJS Angular Form Library to build multi-step forms, surveys, quizzes, assessments, calculator forms, and other data-entry tools. Form definitions and submitted responses can be stored and processed in your own backend and database.

You can create form definitions manually, generate them with AI, or build them visually with [SurveyJS Creator](https://surveyjs.io/survey-creator/documentation/overview), an embeddable drag-and-drop form builder.

## Installation

Requires **Angular v12.0.0 or newer** and the `@angular/cdk` package:

```sh
npm install survey-angular-ui
npm install @angular/cdk --save
```

> Angular v8&ndash;v11 are supported by the legacy [`survey-angular`](https://www.npmjs.com/package/survey-angular) package, which depends on Knockout and is obsolete. See [Add SurveyJS Form Library to an Angular v8&ndash;v11 Application](https://github.com/surveyjs/code-examples/tree/main/legacy-angular/form-library).

## Usage

Import `SurveyModule` in your `NgModule`:

```ts
// app.module.ts
import { SurveyModule } from "survey-angular-ui";

@NgModule({
  imports: [ /* ... */ SurveyModule ],
  // ...
})
export class AppModule { }
```

Build a model and bind it to the `<survey>` element:

```ts
// app.component.ts
import { Component } from "@angular/core";
import { Model } from "survey-core";

const surveyJson = {
  elements: [
    { name: "firstName", title: "Enter your first name:", type: "text" },
    { name: "satisfaction", title: "How satisfied are you?", type: "rating" }
  ]
};

@Component({ selector: "app-root", templateUrl: "./app.component.html" })
export class AppComponent {
  surveyModel = new Model(surveyJson);

  constructor() {
    this.surveyModel.onComplete.add((sender) => {
      console.log(JSON.stringify(sender.data, null, 2));
    });
  }
}
```

```html
<!-- app.component.html -->
<survey [model]="surveyModel"></survey>
```

Add the style sheet to the `styles` array in `angular.json`:

```json
"styles": [
  "src/styles.css",
  "node_modules/survey-core/survey-core.min.css"
]
```

When [using standalone components](https://github.com/surveyjs/code-examples/tree/main/get-started-library/angular-standalone-components), add `SurveyModule` to the component's `imports` array and import the style sheet in the component file instead:

```ts
import "survey-core/survey-core.min.css";
```

This applies the Default theme. For other predefined themes and CSS-variable customization, refer to [Themes & Styles](https://surveyjs.io/form-library/documentation/manage-default-themes-and-styles).

## Theme Adapters

A theme adapter maps an existing design system's CSS variables onto SurveyJS design tokens, so an embedded survey inherits the look of the host application. Adapters ship with `survey-core` as plain CSS — load one after the base style sheet:

```json
"styles": [
  "node_modules/survey-core/survey-core.min.css",
  "node_modules/survey-core/themes/adapters/bootstrap-default.css"
]
```

Adapters are available for [Bootstrap](https://getbootstrap.com) (plus Bootswatch variants), [Material UI](https://mui.com), and [shadcn/ui](https://ui.shadcn.com), with matching icon sets (`survey-core/themes/adapters/icons/lucide`, `.../icons/mui`). See [Theme Adapters](https://surveyjs.io/themes/theme-adapters).

## Key Features

### Dynamic Forms and Surveys

- Render dynamic JSON-driven forms and surveys in Angular applications
- Multi-step forms, quizzes, assessments, calculator forms, and survey pop-ups
- Conditional visibility, branching, calculations, and expression-based logic
- Input validation, save-and-resume workflows(https://surveyjs.io/form-library/examples/save-and-restore-user-responses-to-complete-survey/angular), and dynamic content

### Form Controls

- 20+ built-in question and input types
- Dynamic panels and repeating question groups
- [Custom question types](https://surveyjs.io/form-library/documentation/customize-question-types/question-customization-options) and reusable components
- Electronic signature, image capture, file upload, matrices, and other advanced controls

### Angular Integration

- Native Angular components
- TypeScript support
- Framework-independent form model through `survey-core`
- Client-side rendering without a required SurveyJS backend

### Data and Backend Integration

- [Connect to any server, API, or database](https://surveyjs.io/documentation/backend-integration)
- Store form definitions and submitted responses in your own infrastructure
- [Load choices from web services](https://surveyjs.io/form-library/examples/dropdown-menu-load-data-from-restful-service/angular)
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
| [`survey-react-ui`](https://www.npmjs.com/package/survey-react-ui) | React renderer |
| [`survey-vue3-ui`](https://www.npmjs.com/package/survey-vue3-ui) | Vue 3 renderer |
| [`survey-js-ui`](https://www.npmjs.com/package/survey-js-ui) | HTML/CSS/JavaScript renderer |

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/form-library/documentation/overview)
- [Get Started with Angular](https://surveyjs.io/form-library/documentation/get-started-angular)
- [Form Library Demos for Angular](https://surveyjs.io/form-library/examples/nps-question/angular)
- [Release Notes](https://surveyjs.io/stay-updated/release-notes)
- [Roadmap](https://surveyjs.io/stay-updated/roadmap)
- [What's New](https://surveyjs.io/stay-updated/major-updates/2025-2026)

For AI coding agents: [https://surveyjs.io/llms.txt](https://surveyjs.io/llms.txt) indexes the documentation. Any documentation page is also available as raw Markdown — append `.md` to its URL, for example [https://surveyjs.io/form-library/documentation/get-started-angular.md](https://surveyjs.io/form-library/documentation/get-started-angular.md).

## SurveyJS ecosystem

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
    cd packages/survey-angular-ui
    npm install
    npm run build
    ```

    Build output goes to the `build` directory.

4. **Run a test application**

    ```sh
    cd example
    npm install
    cd ..
    npm run serve:example:dev
    ```

    This runs a local HTTP server at http://localhost:4200/.

5. **Run unit tests**

    Unit tests run through the Angular CLI, which uses [Karma](https://karma-runner.github.io/latest/index.html) and [Jasmine](https://jasmine.github.io/).

    ```sh
    npm run test         # single run, headless Chrome
    npm run test:watch   # watch mode
    ```

6. **Run end-to-end tests**

    E2E, visual-regression, and accessibility tests are Playwright suites. Angular serves a production build of the example app, so build it first. Do not start an HTTP server yourself — the Playwright config runs `serve:example:prod` itself.

    ```sh
    npm run build:example:prod              # produces example/dist
    npm run e2e:ci                          # e2e
    npm run e2e:ci -- --grep "TestName"     # a single test
    npm run scr:ci                          # visual regression
    npm run accessibility-tests:ci          # accessibility
    ```

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
