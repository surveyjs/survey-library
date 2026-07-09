---
title: SurveyElementCore
product: Form Library
api-type: class
description: A base class for the `SurveyElement` and `SurveyModel` classes.
source: https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore
---

# `SurveyElementCore`

A base class for the [`SurveyElement`](https://surveyjs.io/form-library/documentation/surveyelement) and [`SurveyModel`](https://surveyjs.io/form-library/documentation/surveymodel) classes.

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; `SurveyElementCore`

## Properties

### `description`

**Type**: `string`

Explanatory text displayed under the title.

**Related APIs:** [`hasDescription`](#hasDescription)

### `hasDescription`

**Type**: `boolean`

Returns `true` if the survey element has a description.

**Related APIs:** [`description`](#description)

### `title`

**Type**: `string`

A title for the survey element. If `title` is undefined, the `name` property value is displayed instead.

Empty pages and panels do not display their titles or names.

**Related APIs:** [`[Configure Question Titles](https://surveyjs.io/form-library/documentation/design-survey-question-titles)`](#[Configure Question Titles](https://surveyjs.io/form-library/documentation/design-survey-question-titles))
