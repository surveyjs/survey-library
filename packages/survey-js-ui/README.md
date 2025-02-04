# SurveyJS Form Library UI for HTML/CSS/JavaScript Applications

<video src="https://github.com/surveyjs/survey-library/assets/22315929/b24a68bf-d703-4096-835b-752f5f610aa6"></video>

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

A free and open-source MIT-licensed JavaScript form builder library that allows you to design dynamic, data-driven, multi-language survey forms and run them in your vanilla JS applications or integrate them with any frontend framework.

## Features

- Dynamic forms, surveys, polls, and quizzes for your JavaScript application
- Integration with [React](https://www.npmjs.com/package/survey-react-ui), [Angular](https://www.npmjs.com/package/survey-angular-ui), and [Vue](https://www.npmjs.com/package/survey-vue3-ui)
- Possibility of integration with any other frontend framework
- Tiny and fast [Preact](https://preactjs.com/) library at the core
- 20+ built-in question types and support for custom question types
- Built-in themes and CSS customization
- Answer validation
- TypeScript support
- Community-supported UI localization to 50+ languages
- Integration with any backend framework (examples for PHP, NodeJS, and ASP.NET included)
- Compatibility with any server + database combination
- Third-party component integration

## Get Started

To get started with SurveyJS Form Library UI for HTML/CSS/JavaScript applications, refer to the following tutorial: [Add a Survey to a JavaScript Application](https://surveyjs.io/form-library/documentation/get-started-html-css-javascript).

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/form-library/documentation/overview)
- [Live Examples](https://surveyjs.io/form-library/examples/nps-question/)
- [What's New](https://surveyjs.io/WhatsNew)

## Build SurveyJS Form Library UI from Sources

1. [**Build the platform-independent part**](../survey-core/README.md#survey-model-platform-independent-part)

1. **Install SurveyJS Form Library UI dependencies and build this library**

    ```
    cd ../survey-js-ui 
    npm i
    npm run build
    ```

    You can find the built scripts in folders under the `build` directory.

2. **Run a test application**

    ```
    npm run start
    ```

    This command runs a local HTTP server at http://localhost:7777/.

3. **Run unit tests**

    ```
    npm run test
    ```

    The unit tests use [Karma](https://karma-runner.github.io/6.3/index.html).

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).