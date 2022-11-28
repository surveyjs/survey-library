---
title: Troubleshooting | SurveyJS Form Libraries
description: Common errors that occur when you add Form Library component to your app and the ways to troubleshoot them.
---
# Troubleshooting

This help topic describes how to troubleshoot problems that may occur when you use the SurveyJS Form Library in your application.

## The survey doesn't contain visible pages or questions

**Issue**: The survey appears empty, and the following message is displayed: "The survey doesn't contain visible pages or questions".

**Solution**: You may encounter this issue in one of the following cases described below. The solution depends on the case.

### Survey JSON is invalid

When you declare a survey JSON schema or load it from a file or a web server, ensure that it does not contain syntax errors (unclosed brackets or quotation marks, missing commas). Your JSON schema should also follow the [survey structure](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#survey-structure) and declare at least the `elements` property at the first level. Refer to the following help topic for more information: [Define a Static Survey Model in JSON](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#define-a-static-survey-model-in-json).

> Instead of a JSON schema, you can use methods to build a survey model. Refer to the following documentation article for details: [Create or Change a Survey Model Dynamically](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#create-or-change-a-survey-model-dynamically).

### Survey does not contain visible elements

Survey elements become invisible when their [visible](https://surveyjs.io/form-library/documentation/question#visible) property is set to `false` or their [visibleIf](https://surveyjs.io/form-library/documentation/question#visibleIf) expression evaluates to `false`. Ensure that the `visible` property is enabled and the `visibleIf` expressions evaluate to `true`.

### Survey uses an unregistered custom question component

If you implement a custom question component, add it to the survey's `ComponentCollection`. For more information, refer to the following help topic: [Create Specialized Question Types](https://surveyjs.io/survey-creator/documentation/create-specialized-question-types).
