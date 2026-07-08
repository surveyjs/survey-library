---
title: QuestionCheckboxBase
product: Form Library
api-type: class
description: A base class for multiple-selection question types that can display choice items in multiple columns (Checkbox, Radiogroup, Image Picker).
source: https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxbase
---

# `QuestionCheckboxBase`

A base class for multiple-selection question types that can display choice items in multiple columns ([Checkbox](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Radiogroup](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), [Image Picker](https://surveyjs.io/form-library/documentation/questionimagepickermodel)).

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase`

## Properties

### `colCount`

**Type**: `number`

Gets or sets the number of columns used to arrange choice items.

Set this property to 0 if you want to display all items in one line. The default value depends on the available width.
