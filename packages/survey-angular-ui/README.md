# SurveyJS Angular Form Library

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

A free and open-source MIT-licensed JavaScript form builder library that allows you to design dynamic, data-driven, multi-language survey forms and run them in your Angular applications.

> **NOTE**: SurveyJS for Angular requires Angular v12.0.0 or newer and depends on the `@angular/cdk` package. If your project does not include it yet, run the following command:
>
> ```cmd
> npm install @angular/cdk@^12.0.0 --save
> ```
>
> Earlier Angular versions are supported by the [`survey-angular`](https://www.npmjs.com/package/survey-angular) package. It depends on Knockout and is now obsolete. However, you can use it in your Angular v8&ndash;v11 projects. Refer to the following examples on GitHub for more information:
> 
> - [Add SurveyJS Form Library to an Angular v8&ndash;v11 Application](https://github.com/surveyjs/code-examples/tree/main/legacy-angular/form-library)
> - [Add Survey Creator to an Angular v8&ndash;v11 Application](https://github.com/surveyjs/code-examples/tree/main/legacy-angular/survey-creator).


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

To get started with SurveyJS Angular Form Library, refer to the following tutorial: [Add a Survey to an Angular Application](https://surveyjs.io/Documentation/Library?id=get-started-angular).

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/Documentation/Library)
- [Live Examples](https://surveyjs.io/form-library/examples/nps-question/angular)
- [What's New](https://surveyjs.io/WhatsNew)

## Build SurveyJS Angular Form Library from Sources

1. **Clone the repo**

    ```cmd
    git clone https://github.com/surveyjs/survey-library.git
    cd survey-library
    ```

1. **Install dependencies common for all SurveyJS libraries**          
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

1. **Install SurveyJS Angular Form Library dependencies and build this library**

    ```
    cd packages/survey-angular-ui 
    npm i
    npm run build
    ```

    You can find the built scripts and style sheets in folders under the `build` directory.

1. **Run a test application**

    ```
    cd example
    npm i
    cd packages/survey-angular-ui 
    npm run serve:example
    ```

    This command runs a local HTTP server at http://localhost:4200/.

1. **Run unit tests**

    ```
    npm run test
    ```

    The unit tests use [Karma](https://karma-runner.github.io/6.3/index.html).

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).