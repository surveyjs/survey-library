---
title: ValueChangeBaseEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `ValueChangeBaseEvent`

## Inheritance

`QuestionEventMixin` &rarr; `ValueChangeBaseEvent`

## Properties

### `name`

The `name` of the question whose value is being changed. If you use the [`valueName`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#valueName) property, this parameter contains its value.

**Type**: `string`

### `reason`

A value that indicates what caused the value change: an [expression](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions) evaluation or a run of a [trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-survey-logic-triggers). If the value is changed for other reasons, this parameter is `undefined`.

**Type**: `"trigger" | "expression"`
