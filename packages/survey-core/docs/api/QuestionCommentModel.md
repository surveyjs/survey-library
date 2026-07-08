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

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionTextBase` &rarr; `QuestionCommentModel`

## Properties

### `acceptCarriageReturn`

**Type**: `boolean`

Specifies whether the question allows line breaks.

When this property is enabled, a user can press Enter to insert line breaks. They are saved as `\n` in survey results. The Comment question also recognizes and interprets the `\n` sequence as a line break when you set the question `value` in code.

### `allowResize`

**Type**: `boolean`

Specifies whether to display a resize handle for the comment area.

Default value: `true` (inherited from `SurveyModel`'s [`allowResizeComment`](https://surveyjs.io/form-library/documentation/surveymodel#allowResizeComment) property)

[View Demo](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/ (linkStyle))

### `autoGrow`

**Type**: `boolean`

Specifies whether the comment area automatically increases its height to accomodate multi-line content.

Default value: `false` (inherited from `SurveyModel`'s [`autoGrowComment`](https://surveyjs.io/form-library/documentation/surveymodel#autoGrowComment) property)

[View Demo](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/ (linkStyle))

### `rows`

**Type**: `number`

Specifies the visible height of the comment area, measured in lines.

The value of this property is passed on to the `rows` attribute of the underlying `<textarea>` element.

[View Demo](https://surveyjs.io/form-library/examples/add-open-ended-question-to-a-form/ (linkStyle))
