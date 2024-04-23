---
title: Troubleshooting | SurveyJS Form Libraries
description: Common errors that occur when you add Form Library component to your app and the ways to troubleshoot them.
---
# Troubleshooting

This help topic describes how to troubleshoot problems that may occur when you use the SurveyJS Form Library in your application.

## The survey doesn't contain any visible elements.

**Issue**: The survey appears empty, and the following message is displayed: "The survey doesn't contain any visible elements.".

**Solution**: You may encounter this issue in one of the following cases described below. The solution depends on the case.

### Survey JSON is invalid

When you declare a survey JSON schema or load it from a file or a web server, ensure that it does not contain syntax errors (unclosed brackets or quotation marks, missing commas). Your JSON schema should also follow the [survey structure](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#survey-structure) and declare at least the `elements` property at the first level. Refer to the following help topic for more information: [Define a Static Survey Model in JSON](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#define-a-static-survey-model-in-json).

> Instead of a JSON schema, you can use methods to build a survey model. Refer to the following documentation article for details: [Create or Change a Survey Model Dynamically](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#create-or-change-a-survey-model-dynamically).

### Survey does not contain visible elements

Survey elements become invisible when their [visible](https://surveyjs.io/form-library/documentation/question#visible) property is set to `false` or their [visibleIf](https://surveyjs.io/form-library/documentation/question#visibleIf) expression evaluates to `false`. Ensure that the `visible` property is enabled and the `visibleIf` expressions evaluate to `true`.

### Survey uses an unregistered custom question component

If you implement a custom question component, add it to the survey's `ComponentCollection`. For more information, refer to the following help topic: [Create Specialized Question Types](https://surveyjs.io/form-library/documentation/customize-question-types/create-specialized-question-types).

## Answers are duplicated

**Issue**: When a user answers a question, the answer is copied to another question.

**Solution**: Survey uses a question's [`name`](https://surveyjs.io/form-library/documentation/question#name) property value to identify the question and differentiate it from other questions. If you set the same `name` for multiple questions, Survey considers them the same question and copies answers between them. To resolve this issue, specify a unique `name` for each question in your survey.

> If answer duplication is desired behavior, use the [`copyvalue`](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#copyvalue) trigger to implement it.