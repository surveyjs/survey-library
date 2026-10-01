---
title: IDataIssue
product: Form Library
api-type: interface
description: Describes an issue reported by the `SurveyModel.setData()` method.
source: https://surveyjs.io/form-library/documentation/api-reference/idataissue
---

# `IDataIssue`

Describes an issue reported by the [`SurveyModel.setData()`](/form-library/documentation/api-reference/survey-data-model#setData) method.

## Properties

### `expressionResult`

**Type**: `any`

The value stored in the survey after loading.

This property applies only to [`"expressionResultMismatch"`](#type) issues and is `undefined` if the value was removed.

### `path`

**Type**: `string`

The value's location in the survey data, such as `"panel1[2].q1"` or `"matrix.row1.col1"`.

This path is intended for display, not parsing, because property names are not escaped.

### `question`

**Type**: `Question`

The question associated with the issue, or `undefined` if the data property does not correspond to a question.

For nested values, this is the cell or panel question. For an [`"expressionResultMismatch"`](#type) issue, it is the question associated with the root data property.

### `type`

**Type**: `"unknownProperty" | "invalidValueType" | "invalidChoiceValue" | "expressionResultMismatch"`

Identifies the issue type.

Possible values:

- `"unknownProperty"`\
A data property does not correspond to a recognized survey result field.

- `"invalidValueType"`\
A value's type or structure does not match the question configuration.

- `"invalidChoiceValue"`\
A value does not match an available choice, matrix column or row, or rating value.

- `"expressionResultMismatch"`\
A value was added, changed, or removed by expressions, defaults, triggers, or other logic applied during loading.

### `value`

**Type**: `any`

The value associated with the issue.

For an [`"expressionResultMismatch"`](#type) issue, this is the original value from the supplied data.
