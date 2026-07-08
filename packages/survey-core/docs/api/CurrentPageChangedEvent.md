---
title: CurrentPageChangedEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `CurrentPageChangedEvent`

## Properties

### `isPrevPage`

Returns `true` if the respondent is switching to the previous page.

**Type**: `boolean`

### `isNextPage`

Returns `true` if the respondent is switching to the next page.

**Type**: `boolean`

### `isGoingBackward`

Returns `true` if the respondent is going backward, that is, `newCurrentPage` or `newCurrentQuestion` is earlier in the survey than `oldCurrentPage`  or `oldCurrentQuestion`.

**Type**: `boolean`

### `isGoingForward`

Returns `true` if the respondent is going forward along the survey.

**Type**: `boolean`

### `isAfterPreview`

Returns `true` if the respondent is switching from the [preview page](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).

**Type**: `boolean`

### `newCurrentPage`

The current page.

**Type**: `PageModel`

### `oldCurrentPage`

A page that used to be current.\
In [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode), the `oldCurrentPage` and `newCurrentPage` parameters may contain the same `PageModel` instance. This is because the survey doesn't create artificial pages to display only one question per page. If both the previous and current questions belong to the same page in the survey JSON schema, they have the same parent `PageModel` instance.

**Type**: `PageModel`

### `oldCurrentQuestion`

The current question.\
This parameter has a value only in [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).

**Type**: `Question`

### `newCurrentQuestion`

A question that used to be current.\
This parameter has a value only in [question-per-page mode](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode).

**Type**: `Question`
