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

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionSelectBase`](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase.md) &rarr; `QuestionCheckboxBase`

## Properties

### `colCount`

**Type**: `number`

Gets or sets the number of columns used to arrange choice items.

Set this property to 0 if you want to display all items in one line. The default value depends on the available width.

**Related APIs:** [`separateSpecialChoices`](#separateSpecialChoices)
