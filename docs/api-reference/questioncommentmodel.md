---
title: QuestionCommentModel
product: Form Library
api-type: class
description: A class that describes the Long Text question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questioncommentmodel
---

# `QuestionCommentModel`

A class that describes the Long Text question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-comment/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionTextBase`](https://surveyjs.io/form-library/documentation/api-reference/questiontextbase.md) &rarr; `QuestionCommentModel`

## Properties

### `allowResize`

**Type**: `boolean`

Specifies whether to display a resize handle for the comment area.

Default value: `true` (inherited from `SurveyModel`'s [`allowResizeComment`](https://surveyjs.io/form-library/documentation/surveymodel#allowResizeComment) property)

[View Demo](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/ (linkStyle))

**Related APIs:** [`autoGrow`](#autoGrow)

### `autoGrow`

**Type**: `boolean`

Specifies whether the comment area automatically increases its height to accomodate multi-line content.

Default value: `false` (inherited from `SurveyModel`'s [`autoGrowComment`](https://surveyjs.io/form-library/documentation/surveymodel#autoGrowComment) property)

[View Demo](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/ (linkStyle))

**Related APIs:** [`allowResize`](#allowResize)

### `rows`

**Type**: `number`

Specifies the visible height of the comment area, measured in lines.

The value of this property is passed on to the `rows` attribute of the underlying `<textarea>` element.

[View Demo](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/ (linkStyle))
