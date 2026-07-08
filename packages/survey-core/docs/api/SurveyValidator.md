---
title: SurveyValidator
product: Form Library
api-type: class
description: A base class for all classes that implement validators.
source: https://surveyjs.io/form-library/documentation/api-reference/surveyvalidator
---

# `SurveyValidator`

A base class for all classes that implement validators.

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyValidator`

## Properties

### `notificationType`

Specifies the type of notification shown to users.

Possible values:

- `"error"`
- `"warning"`
- `"info"`

Errors block survey progress until resolved. Warnings indicate potential issues but don't block respondents from continuing the survey. Informational notes provide guidance without restrictions.

> If multiple notification types are eligible to be displayed for a question, only the strongest type is shown. Warnings appear only after all errors are resolved, and notes appear only when there are no errors or warnings.

**Type**: `string`

### `text`

An error message to display when a value fails validation.

**Type**: `string`
