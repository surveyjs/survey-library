---
title: IExpressionValidationResult
product: Form Library
api-type: interface
description: An interface that describes the result returned by the `validateExpressions` method.
source: https://surveyjs.io/form-library/documentation/api-reference/iexpressionvalidationresult
---

# `IExpressionValidationResult`

An interface that describes the result returned by the [`validateExpressions`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#validateExpressions) method.

## Properties

### `errors`

A list of validation errors detected in the expression.

Each error object in this array may contain the following properties:

- `errorType`: `ExpressionErrorType`\
The type of validation error: 0 &ndash; `SyntaxError`, 1 &ndash; `UnknownFunction`, 2 &ndash; `UnknownVariable`, or 3 &ndash; `SemanticError`.

- `functionName`: `string`\
The name of the unknown function. Present only when `errorType` is `UnknownFunction`.

- `variableName`: `string`\
The name of the unknown variable. Present only when `errorType` is `UnknownVariable`.

**Type**: `IExpressionError[]`

### `obj`

A SurveyJS object (question, panel, page, collection item, or the survey itself) that contains the validated expression.

**Type**: `Base`

### `propertyName`

The name of the property that holds the expression.

**Type**: `string`
