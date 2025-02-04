# Survey Model (Platform-Independent Part) 


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

A platform-independent survey model for SurveyJS Form Library. This package should be used with one of platform-specific UI rendering packages. Refer to the following Get Started tutorials for more information:

- [Angular](https://surveyjs.io/Documentation/Library?id=get-started-angular)
- [React](https://surveyjs.io/Documentation/Library?id=get-started-react)
- [Vue](https://surveyjs.io/Documentation/Library?id=get-started-vue)
- [HTML/CSS/JavaScript](https://surveyjs.io/form-library/documentation/get-started-html-css-javascript)

## Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/Documentation/Library)
- [Live Examples](https://surveyjs.io/Examples/Library)
- [What's New](https://surveyjs.io/WhatsNew)

## Build Survey Model from Sources

1. **Clone the repo**

    ```
    git clone https://github.com/surveyjs/survey-library.git
    cd survey-library/packages/survey-core
    ```

2. **Install dependencies**          
Make sure that you have Node.js v16 or later and a compatible npm version installed.

    ```
    npm install
    ```

3. **Build the library**

    ```
    npm run build:all
    ```

    You can find the built scripts and style sheets in folders under the `build` directory.

4. **Run unit tests**

    ```
    npm run test
    ```

    The unit tests use [Karma](https://karma-runner.github.io/6.3/index.html).

After that, you can build one of the UI packages:

- [Angular Form Library](../survey-angular-ui/README.md#build-surveyjs-angular-form-library-from-sources)
- [React Form Library](../survey-react-ui/README.md#build-surveyjs-react-form-library-from-sources)
- [Vue Form Library](../survey-vue3-ui/README.md#build-surveyjs-vue-form-library-from-sources)
- [HTML/CSS/JS Form Library](../survey-js-ui/README.md#build-surveyjs-form-library-ui-from-sources)

## Licensing

SurveyJS Form Library is distributed under the [MIT license](https://github.com/surveyjs/survey-library/blob/master/LICENSE).
