---
title: QuestionRadiogroupModel
product: Form Library
api-type: class
description: A class that describes the Radio Button Group question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionradiogroupmodel
---

# `QuestionRadiogroupModel`

A class that describes the Radio Button Group question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-radiogroup/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase` &rarr; `QuestionRadiogroupModel`

## Properties

### `allowClear`

**Type**: `boolean`

Specifies whether to display a button that clears the question value.

Default value: `false`

### `selectedItem`

**Type**: `ChoiceItem`

Returns the selected choice item. If no item is selected, returns `null`.
