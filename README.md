<div align="center">
    
![Library](https://github.com/surveyjs/survey-library/assets/102306951/d200bacb-b162-496c-a157-981e0623bae0)
    
</div>

<div align="center">

[![Build Status](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_apis/build/status/SurveyJS%20Library?branchName=master)](https://dev.azure.com/SurveyJS/SurveyJS%20Integration%20Tests/_build/latest?definitionId=7&branchName=master)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)
<a href="https://github.com/DevExpress/testcafe">
<img alt="Tested with TestCafe" src="https://img.shields.io/badge/tested%20with-TestCafe-2fa4cf.svg">
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

SurveyJS Form Library is a free to use MIT-licensed client-side component that allows you to render dynamic JSON-based forms in any JavaScript application, collect responses, and send all form submission data to a database of your choice. You can use it for multi-page forms of any length and complexity, pop-up surveys, quizzes, scored surveys, calculator forms, and more. SurveyJS Form Library has **native support for React, Angular, Vue, and Knockout;** jQuery is supported via a wrapper over the Knockout version. The library interacts with the server using JSON objects&mdash;for both form metadata, also known as form JSON schemas, and results. The [SurveyJS product family](https://surveyjs.io/) also includes a robust [form builder library](https://surveyjs.io/survey-creator/documentation/overview) that automatically generates form configuration files in JSON format. The form builder features a drag-and-drop UI, CSS Theme Editor, and GUI for conditional logic and form branching.

</div>
<br>

<p align="center">
    <a href="https://surveyjs.io/form-library/documentation/overview">Documentation</a>
    ·
    <a href="https://surveyjs.io/stay-updated/roadmap">Roadmap</a>
    ·
    <a href="https://surveyjs.io/form-library/examples/overview">View Demos</a>
    ·
    <a href="https://surveyjs.io/create-free-survey">Generate JSON form</a>
    ·
    <a href="https://github.com/surveyjs/survey-library/issues/new">Report Bug</a>
    ·
    <a href="https://twitter.com/SurveyJS">Twitter</a>
  </p>
  
<br>

https://github.com/surveyjs/survey-library/assets/102306951/844563b2-c7c3-400c-962f-bcdbe7274d55


## Features

- It's suitable for multi-page forms, quizzes, scored surveys, calculator forms, and survey pop-ups
- Integration with React, Angular, Vue, jQuery, and Knockout
- [Compatible with any server & database](https://surveyjs.io/documentation/backend-integration)
- [Integration examples for PHP, ASP.NET Core, and NodeJS](https://surveyjs.io/backend-integration/examples)
- [All data is stored on your own servers](https://surveyjs.io/form-library/documentation/how-to-store-survey-results); therefore, there are no limits on the number of forms, submissions, and file uploads
- 20+ accessible input types, panels for question grouping, dynamic questions with a duplicate group option
- [Input validation](https://surveyjs.io/form-library/documentation/data-validation), partial submits & auto-save, lazy loading, load choices from web services
- Custom input fields
- Carry forward responses, text piping, autocomplete
- Integration with 3rd-party libraries and payment systems
- Support for webhooks
- Expression language (Built-in & Custom Functions), data aggregation within a form
- TypeScript support
- [Auto-localization and multi-locale surveys](https://surveyjs.io/form-library/documentation/survey-localization), support for RTL languages
- [Weekly updates](https://surveyjs.io/stay-updated/release-notes)
- [120+ starter demos & tutorials](https://surveyjs.io/form-library/examples/overview)
- Community-supported UI localization to 50+ languages
- Built-in themes and CSS customization
- e-Signature field
- Image capture
- All popular types of form navigation

## Get Started

- [Angular](https://surveyjs.io/Documentation/Library?id=get-started-angular)
- [React](https://surveyjs.io/Documentation/Library?id=get-started-react)
- [Vue](https://surveyjs.io/Documentation/Library?id=get-started-vue)
- [jQuery](https://surveyjs.io/Documentation/Library?id=get-started-jquery)
- [Knockout](https://surveyjs.io/Documentation/Library?id=get-started-knockout)

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/form-library/documentation/overview)
- [Starter Demos](https://surveyjs.io/form-library/examples/overview)
- [What's New](https://surveyjs.io/stay-updated/major-updates/2023)

## SurveyJS Product Family

- [**Form Library**](https://surveyjs.io/form-library/documentation/overview) - A free and open-source MIT-licensed JavaScript library that renders dynamic JSON-based forms in your web application, and collects responses.
- [**Survey Creator**](https://surveyjs.io/survey-creator/documentation/overview) - A self-hosted drag-and-drop form builder that automatically generates JSON definition (schemas) of your forms in real time. Try out a [free full-featured demo](https://surveyjs.io/create-free-survey) to evaluate its capabilities.
-  [**Dashboard**](https://surveyjs.io/dashboard/documentation/overview) - Simplifies survey data visualization and analysis with interactive and customizable charts and tables.
-  [**PDF Generator**](https://surveyjs.io/pdf-generator/documentation/overview) - An open-source JavaScript library that renders SurveyJS surveys and forms as PDF files in a browser. With PDF Generator you can save an unlimited number of custom-built forms to PDF (both editable and read-only).

## Build the SurveyJS Form Library from Sources

> The instructions below apply to SurveyJS Form Library for React, Knockout, jQuery, and Vue 2. If you are looking for instructions on how to build the library for Angular or Vue 3, refer to README files within the [`survey-angular-ui`](packages/survey-angular-ui/README.md#build-surveyjs-angular-form-library-from-sources) or [`survey-vue3-ui`](packages/survey-vue3-ui/README.md#build-surveyjs-vue-form-library-from-sources) packages.

1. **Clone the repo**

    ```cmd
    git clone https://github.com/surveyjs/survey-library.git
    cd survey-library
    ```

1. **Install dependencies**          
Make sure that you have Node.js v14 or later and a compatible npm version installed.

    ```cmd
    npm install -g karma-cli
    npm install
    ```

1. **Build the [platform-independent part](https://github.com/surveyjs/survey-library/blob/master/build-scripts/survey-core/README.md#survey-model-platform-independent-part) and plugins**

    ```
    npm run build_core
    npm run build-plugins
    ```

1. **Build the library**

    ```
    npm run build
    ```

    You can find the built scripts and style sheets in folders under the `build` directory.

1. **Run test examples**

    ```
    npm run serve
    ```

    This command runs a local HTTP server at http://localhost:7777/.

1. **Run unit tests**

    ```
    npm run test
    ```

    The unit tests use [Karma](https://karma-runner.github.io/6.3/index.html).

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
