# SurveyJS Vue Form Library (Vue 3)

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

A free and open-source MIT-licensed JavaScript form builder library that allows you to design dynamic, data-driven, multi-language survey forms and run them in your Vue applications.

> **NOTE**: This package contains a version of SurveyJS Form Library for Vue 3. If you are looking for a Vue 2 version, refer to the [survey-vue-ui](https://www.npmjs.com/package/survey-vue-ui) npm package.

## Features

- Dynamic forms, surveys, polls, and quizzes for your JavaScript application
- Integration with React, Angular, Vue, jQuery, and Knockout
- 20+ built-in question types and support for custom question types
- Built-in themes and CSS customization
- Answer validation
- TypeScript support
- Community-supported UI localization to 50+ languages
- Integration with any backend framework (examples for PHP, NodeJS, and ASP.NET included)
- Compatibility with any server + database combination
- Third-party component integration

## Get Started

To get started with SurveyJS Vue Form Library, refer to the following tutorial: [Add a Survey to a Vue 3 Application](https://surveyjs.io/form-library/documentation/get-started-vue#add-a-survey-to-a-vue-3-application).

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/Documentation/Library)
- [Live Examples](https://surveyjs.io/form-library/examples/nps-question/vuejs)
- [What's New](https://surveyjs.io/WhatsNew)

## Build SurveyJS Vue Form Library from Sources

1. **Clone the repo**

    ```cmd
    git clone https://github.com/surveyjs/survey-library.git
    cd survey-library
    ```

1. **Install dependencies common for all SurveyJS libraries**          
Make sure that you have Node.js v16 or later and a compatible npm version installed.

    ```cmd
    npm install -g karma-cli
    npm install
    ```

1. **Build the [platform-independent part](https://github.com/surveyjs/survey-library/blob/master/build-scripts/survey-core/README.md#survey-model-platform-independent-part) and plugins**

    ```
    npm run build_core
    npm run build-plugins
    ```

1. **Install SurveyJS Vue Form Library dependencies and build this library**

    ```
    cd packages/survey-vue3-ui 
    npm i
    npm run build
    ```

    You can find the built scripts and style sheets in folders under the `build` directory.

1. **Run a test application**

    ```
    npm run dev
    ```

    This command runs a local HTTP server at http://localhost:5173/.

2. **Run unit tests**

    ```
    npm run test
    ```

    The unit tests use [Karma](https://karma-runner.github.io/6.3/index.html).

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).