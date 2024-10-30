<!-- omit in toc -->
# Contributing to SurveyJS Form Library

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

If you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:

- Star the project
- Tweet about it
- Refer this project in your project's readme
- Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->
## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Style Guides](#style-guides)

## Code of Conduct

This project and everyone participating in it is governed by the [SurveyJS Form Library Code of Conduct](https://github.com/surveyjs/survey-library/blob/master/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to info@devsoftbaltic.com.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://surveyjs.io/form-library/documentation/overview).

Before you ask a question, it is best to search for existing [Issues](https://github.com/surveyjs/survey-library/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/surveyjs/survey-library/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->
#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side, e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://surveyjs.io/form-library/documentation/overview). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/surveyjs/survey-library/issues?q=label%3Abug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside the GitHub community have discussed the issue.
- Collect information about the bug:
  - Browser version
  - JavaScript framework/library you use (Angular, React, Vue 2, Vue 3, Knockout, jQuery, or Vanilla JS)
  - Possibly your input and the output
  - Can you reliably reproduce the issue? Can you also reproduce it with older versions?

<!-- omit in toc -->
#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities, or bugs including sensitive information to the issue tracker or elsewhere in public. Instead, sensitive bugs must be sent by email to info@devsoftbaltic.com.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/surveyjs/survey-library/issues/new/choose). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once the issue is filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps. Bugs that cannot be reproduced will not be addressed until the reproduction steps are provided.
- If the team is able to reproduce the issue, it will be marked `bug`, and the issue will be left to be [implemented by someone](#your-first-code-contribution).

> We work hard to makes sure issues are handled in a timely manner but, depending on the scope and complexity of the issue, it could take a while to investigate the root cause. A friendly reminder in the comment thread to the submitter or a contributor can help draw attention if your issue is blocking.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for SurveyJS Form Library, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->
#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://surveyjs.io/form-library/documentation/overview) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/surveyjs/survey-library/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

<!-- omit in toc -->
#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/surveyjs/survey-library/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to.
- **Explain why this enhancement would be useful** to most SurveyJS Form Library users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

### Your First Code Contribution

SurveyJS Team follows the [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) in development. It means that all proposed changes to our codebase should be made via pull requests. Here's how you can contribute to the SurveyJS codebase:

1. Fork the repository and create a branch from `master`.
2. Change the code as required and add a test to ensure that your code works as expected.
3. If you're implementing a UI feature, make sure to do this for the following frontend frameworks supported by SurveyJS: React, Angular, Vue 2, Vue 3, and Knockout.
4. [Build the library](./README.md#build-the-surveyjs-form-library-from-sources).
5. Run our test suite from the root folder and ensure all tests are successfully passed:
     - Unit tests: `npm run test`
     - Markup tests: `npm run test:markup`
     - Functional tests: `npm run testcafe`
     - Screenshot tests: `npm run visual-regression-tests`
     - Accessibility tests: `npm run accessibility-tests`
     - Lint checks: `npm run lint`
6. Push your branch to our repository and create a pull request.

## Style Guides

The SurveyJS codebase adheres to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). Please make sure that your code follows this guide when [making code contributions](#your-first-code-contribution).

<!-- omit in toc -->
## Attribution
This guide is based on the **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!