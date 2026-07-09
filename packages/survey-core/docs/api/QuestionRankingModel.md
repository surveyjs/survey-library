---
title: QuestionRankingModel
product: Form Library
api-type: class
description: A class that describes the Ranking question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionrankingmodel
---

# `QuestionRankingModel`

A class that describes the Ranking question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-ranking/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionSelectBase`](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase.md) &rarr; [`QuestionCheckboxBase`](https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxbase.md) &rarr; [`QuestionCheckboxModel`](https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxmodel.md) &rarr; `QuestionRankingModel`

## Properties

### `longTap`

**Type**: `boolean`

Specifies whether to use a long tap (press and hold) gesture to start dragging.

Default value: `true`

Disable this property if you want to start dragging when users perform a scroll gesture.

### `selectToRankAreasLayout`

**Type**: `string`

Specifies the layout of the ranked and unranked areas. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.

Possible values:

- `"horizontal"` (default) - The ranked and unranked areas are positioned next to each other. Users drag and drop choices between them in the horizontal direction.
- `"vertical"`- The ranked area is positioned above the unranked area. Users drag and drop choices between them in the vertical direction.

[View Demo](https://surveyjs.io/form-library/examples/select-items-to-rank/ (linkStyle))

**Related APIs:** [`selectToRankAreasLayout`](#selectToRankAreasLayout)

### `selectToRankEmptyRankedAreaText`

**Type**: `string`

A placeholder displayed in the area for ranked choices. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.

### `selectToRankEmptyUnrankedAreaText`

**Type**: `string`

A placeholder displayed in the area for unranked choices. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.

### `selectToRankEnabled`

**Type**: `boolean`

Specifies whether users can select choices they want to rank.

When you enable this property, the Ranking question displays two areas for ranked and unranked choices. To order choices, users should first drag them from the unranked to the ranked area. Use this mode if you want to let users order only the choices they select.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/select-items-to-rank/ (linkStyle))

**Related APIs:** [`selectToRankAreasLayout`](#selectToRankAreasLayout)
