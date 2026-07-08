---
title: ValidateQuestionEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `ValidateQuestionEvent`

## Inheritance

`QuestionEventMixin` &rarr; `ValidateQuestionEvent`

## Properties

### `value`

A question value being validated.

**Type**: `any`

### `name`

The question's name.

**Type**: `string`

### `error`

An error message that you should specify if custom validation fails.

**Type**: `string`

### `errors`

An array of other validation errors that you can modify. The array is empty if the validated question satisfies all validation rules.

**Type**: `SurveyError[]`
