# SurveyJS Form Library

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

A free and open-source MIT-licensed JavaScript form builder library that allows you to design dynamic, data-driven, multi-language survey forms and run them in your web applications.

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

- [Angular](https://surveyjs.io/Documentation/Library?id=get-started-angular)
- [React](https://surveyjs.io/Documentation/Library?id=get-started-react)
- [Vue](https://surveyjs.io/Documentation/Library?id=get-started-vue)
- [jQuery](https://surveyjs.io/Documentation/Library?id=get-started-jquery)
- [Knockout](https://surveyjs.io/Documentation/Library?id=get-started-knockout)

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/Documentation/Library)
- [Live Examples](https://surveyjs.io/Examples/Library)
- [What's New](https://surveyjs.io/WhatsNew)

## Build the SurveyJS Form Library from Sources

1. **Clone the repo**

    ```cmd
    git clone https://github.com/surveyjs/survey-library.git
    cd survey-library
    ```

1. **Install dependencies**          
Make sure that you have Node.js v6.0.0 or later and npm v2.7.0 or later installed.

    ```cmd
    npm install -g karma-cli
    npm install
    ```

1. **Build the library**

    ```
    npm run build_prod
    ```

    You can find the built scripts and style sheets in folders under the `build` directory.

1. **Run test examples**

    ```
    npm start
    ```

    This command runs a local HTTP server at http://localhost:7777/.

1. **Run unit tests**

    ```
    npm run test
    ```

    The unit tests use [Karma](https://karma-runner.github.io/6.3/index.html).

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
