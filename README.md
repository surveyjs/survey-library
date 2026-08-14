<div align="center">
    
<img width="1200" height="600" alt="banner_form_library" src="https://github.com/user-attachments/assets/71d43a86-942b-4de9-9948-1ab05ec70e8c" />
    
</div>

<div align="center"><br>

[![Build Status](https://dev.azure.com/SurveyJS/V2%20Libraries/_apis/build/status%2Flibrary%2FLibrary%20Main?repoName=surveyjs%2Fsurvey-library&branchName=master)](https://dev.azure.com/SurveyJS/V2%20Libraries/_build/latest?definitionId=130&repoName=surveyjs%2Fsurvey-library&branchName=master)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)
<a href="https://github.com/microsoft/playwright">
<img alt="Tested with Playwright" src="https://img.shields.io/badge/tested%20with-Playwright-2fa4cf.svg">
</a>
<a href="https://github.com/surveyjs/survey-library/issues">
<img alt="Issues" title="Open Issues" src="https://img.shields.io/github/issues/surveyjs/survey-library.svg">
</a>
<a href="https://github.com/surveyjs/survey-library/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aclosed+">
<img alt="Closed issues" title="Closed Issues" src="https://img.shields.io/github/issues-closed/surveyjs/survey-library.svg">
</a>
<a href="https://surveyjs.io/stay-updated/release-notes">
<img alt="GitHub Release" src="https://img.shields.io/github/v/release/surveyjs/survey-library">
</a>
    
# SurveyJS Form Library

</div>

<div align="justify">

SurveyJS Form Library is a free and open-source JavaScript form library for rendering dynamic, JSON-based forms and surveys in React, Angular, Vue, and plain JavaScript applications. It collects responses in the browser and lets you send submitted data to any backend or database.

Use it to build complex multi-step forms, pop-up surveys, quizzes, scored surveys, calculator forms, and other data-entry tools. Form content and structure, validation, conditional logic, navigation, and appearance are defined through a SurveyJS JSON form definition.

You can create form definitions manually, generate them with AI, or build them visually with [SurveyJS Creator](https://surveyjs.io/survey-creator/documentation/overview), an embeddable drag-and-drop form builder.

</div>
<br>

<p align="center">
    <a href="https://surveyjs.io/form-library/documentation/overview">Documentation</a>
    ·
    <a href="https://surveyjs.io/find-surveyjs-guides-for-my-stack">Setup Guides for My Stack</a>
    ·
    <a href="https://surveyjs.io/form-library/examples/overview">Form Library Demos</a>
    ·
    <a href="https://surveyjs.io/themes/theme-adapters">Theme Adapters</a>
    ·
    <a href="https://surveyjs.io/form-library/documentation/how-to-store-survey-results">Store survey results</a>
    ·
    <a href="https://github.com/surveyjs/survey-library/issues/new">Report Bug</a>
  </p>
  
<br>

https://github.com/surveyjs/survey-library/assets/102306951/844563b2-c7c3-400c-962f-bcdbe7274d55

## How It Works

SurveyJS Form Library renders forms from JSON definitions directly in your web application. It runs in the browser and does not require a SurveyJS backend, so you retain control over form definitions, submitted responses, and data storage.

Your application can:

1. Create or load a SurveyJS JSON form definition.
2. Render it with SurveyJS Form Library.
3. Collect responses in the browser.
4. Send submitted data to your backend.
5. Store it in the database or service of your choice.
   
## Installation

Choose the package for your framework:

### React Form Library

```bash
npm install survey-react-ui
```
[Get Started with Form Library for React](https://surveyjs.io/form-library/documentation/get-started-react)

### Angular Form Library

```bash
npm install survey-angular-ui
```
[Get Started with Form Library for Angular](https://surveyjs.io/form-library/documentation/get-started-angular)

### Vue.js Form Library

```bash
npm install survey-vue3-ui
```
[Get Started with Form Library for Vue.js](https://surveyjs.io/form-library/documentation/get-started-vue)

### Plain JavaScript Form Library

```bash
npm install survey-js-ui
```
[Get Started with Form Library for Plain JavaScript](https://surveyjs.io/form-library/documentation/get-started-html-css-javascript)

## Package Architecture

SurveyJS Form Library separates form logic from rendering. The framework-independent [`survey-core`](https://github.com/surveyjs/survey-library/tree/master/packages/survey-core) package provides the form model, validation, conditional logic, calculations, navigation, localization, and other core behavior. Framework-specific packages such as [`survey-react-ui`](https://github.com/surveyjs/survey-library/tree/master/packages/survey-react-ui), [`survey-angular-ui`](https://github.com/surveyjs/survey-library/tree/master/packages/survey-angular-ui), and [`survey-vue3-ui`](https://github.com/surveyjs/survey-library/tree/master/packages/survey-vue3-ui) render that model in React, Angular, and Vue 3 applications. Installing a rendering package brings `survey-core` with it — you build a model from JSON with `survey-core` and bind it to this package's `<survey>` component to display.

## Key Features

### Dynamic Forms and Surveys

- Multi-step forms, quizzes, scored surveys, calculator forms, and survey pop-ups
- Conditional visibility, branching, calculated values, and expression-based logic
- Input validation, [partial submissions](https://surveyjs.io/form-library/examples/save-and-restore-user-responses-to-complete-survey/reactjs), auto-save, and lazy loading
- Dynamic panels, repeating question groups, carry-forward responses, and text piping
- Multiple navigation modes for long and complex forms

### Multi-Framework Support

- Dedicated Form Library rendering packages for React, Angular, Vue 3, and plain JavaScript
- TypeScript support
- Client-side rendering with no required SurveyJS backend

### Data and Backend Integration

- [Connect to any server, API, or database](https://surveyjs.io/documentation/backend-integration)
- Store form definitions and submitted responses in your own infrastructure
- [Load choices from web services](https://surveyjs.io/form-library/examples/dropdown-menu-load-data-from-restful-service/reactjs)
- Integrate with third-party libraries, payment systems, and custom backend workflows
- [Backend integration examples for PHP, ASP.NET Core, and Node.js](https://surveyjs.io/backend-integration/examples)

### Form Controls

- 20+ built-in question and input types
- [Custom question types and input components](https://surveyjs.io/form-library/documentation/customize-question-types/question-customization-options)
- Electronic signature and image capture
- Reusable composite questions and third-party widgets

### Localization and Accessibility

- Community-supported localization for 50+ languages
- Multi-language forms and automatic locale selection
- Right-to-left language support
- Accessible input controls and keyboard navigation

### Appearance and UI Customization

- Shared design token system based on CSS variables
- Built-in themes with support for custom branding
- [Theme Adapters for Bootstrap, Material UI, and shadcn/ui](https://surveyjs.io/themes/theme-adapters)
- Custom question rendering and reusable UI components
- Configurable layouts, navigation controls, validation messages, and form behavior

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/form-library/documentation/overview)
- [Full-Featured Demo](https://surveyjs.io/create-free-survey)
- [Release Notes](https://surveyjs.io/stay-updated/release-notes)
- [Roadmap](https://surveyjs.io/stay-updated/roadmap)
- [What's New](https://surveyjs.io/stay-updated/major-updates/2025-2026)

## SurveyJS Product Family

- [Form Library](https://surveyjs.io/form-library/documentation/overview) - A free and open-source MIT-licensed JavaScript library that renders dynamic JSON-based forms in your web application, and collects responses.
- [Survey Creator](https://surveyjs.io/survey-creator/documentation/overview) - An embeddable drag-and-drop form builder that generates SurveyJS JSON form definitions. Try out a [free full-featured demo](https://surveyjs.io/create-free-survey) to evaluate its capabilities.
- [Dashboard](https://surveyjs.io/dashboard/documentation/overview) - Simplifies survey data visualization and analysis with interactive and customizable charts and tables.
- [PDF Generator](https://surveyjs.io/pdf-generator/documentation/overview) - Renders SurveyJS surveys and forms as PDF files in a browser. Save custom forms to PDF (both editable and read-only).

## Build from Source

1. [**Build the platform-independent part**](./packages/survey-core/README.md#survey-model-platform-independent-part)

2. **Build one of the UI packages**

   - [Angular Form Library](./packages/survey-angular-ui/README.md#build-surveyjs-angular-form-library-from-sources)
   - [React Form Library](./packages/survey-react-ui/README.md#build-surveyjs-react-form-library-from-sources)
   - [Vue Form Library](./packages/survey-vue3-ui/README.md#build-surveyjs-vue-form-library-from-sources)
   - [HTML/CSS/JS Form Library](./packages/survey-js-ui/README.md#build-surveyjs-form-library-ui-from-sources)

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
