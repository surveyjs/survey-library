---
title: PageModel
product: Form Library
api-type: class
description: The `PageModel` object describes a survey page and contains properties and methods that allow you to control the page and access its elements (panels and questions).
source: https://surveyjs.io/form-library/documentation/api-reference/pagemodel
---

# `PageModel`

The `PageModel` object describes a survey page and contains properties and methods that allow you to control the page and access its elements (panels and questions).

[View Demo](https://surveyjs.io/form-library/examples/nps-question/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`PanelModelBase`](https://surveyjs.io/form-library/documentation/api-reference/panelmodelbase.md) &rarr; [`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panelmodel.md) &rarr; `PageModel`

## Properties

### `isActive`

**Type**: `boolean`

Returns `true` if this is the current page.

**Related APIs:** [`SurveyModel.currentPage`](#SurveyModel.currentPage)

### `isStartPage`

**Type**: `boolean`

Returns `true` if this page is a start page.

Refer to the following help topic for more information on how to configure a start page: [Start Page](https://surveyjs.io/form-library/documentation/design-survey-create-a-multi-page-survey#start-page).

### `navigationDescription`

**Type**: `string`

Specifies the description text displayed on a navigation button in the progress bar. Applies when [`showProgressBar`](#showProgressBar) is `true`, [`progressBarType`](#progressBarType) is set to `"pages"`, and [`progressBarShowNavigationText`](#progressBarShowNavigationText) is `true`.

**Related APIs:** [`navigationTitle`](#navigationTitle)

### `navigationTitle`

**Type**: `string`

Specifies the title text displayed on a navigation button in the TOC or progress bar. Applies when [`showTOC`](#showTOC) is `true` or when [`showProgressBar`](#showProgressBar) is `true`, [`progressBarType`](#progressBarType) is set to `"pages"`, and [`progressBarShowNavigationText`](#progressBarShowNavigationText) is `true`.

If `navigationTitle` is not specified, the navigation button displays the page [`title`](https://surveyjs.io/form-library/documentation/api-reference/page-model#title) or [`name`](https://surveyjs.io/form-library/documentation/pagemodel#name).

[Table of Contents Demo](https://surveyjs.io/form-library/examples/table-of-contents/ (linkStyle))

[Progress Bar Demo](https://surveyjs.io/form-library/examples/configure-form-navigation-with-progress-indicators/ (linkStyle))

**Related APIs:** [`navigationDescription`](#navigationDescription)

### `showNavigationButtons`

**Type**: `string | boolean`

Gets or sets the visibility of the Start, Next, Previous, and Complete navigation buttons on this page. Overrides the [`showNavigationButtons`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showNavigationButtons) property specified on the survey-level.

Default value: `undefined` (the visibility depends on the survey-level setting)

### `timeLimit`

**Type**: `number`

A time period that a respondent has to complete this page; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

Default value: 0 (time is unlimited)

Alternatively, you can use the `SurveyModel`'s [`timeLimitPerPage`](https://surveyjs.io/form-library/documentation/surveymodel#timeLimitPerPage) property to specify identical time periods for all survey pages.

**Related APIs:** [`timeSpent`](#timeSpent)

### `timeSpent`

**Type**: `number`

A time period that a respondent has spent on this page so far; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

**Related APIs:** [`timeLimit`](#timeLimit)

### `visibleIndex`

**Type**: `number`

The visible index of the page. It has values from 0 to visible page count - 1.

**Related APIs:** [`SurveyModel.visiblePages`](#SurveyModel.visiblePages), [`SurveyModel.pages`](#SurveyModel.pages)

### `wasShown`

**Type**: `boolean`

Returns `true` if the respondent has already seen this page (it was rendered during the current session or its visited state was restored via [`uiState`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#uiState)).

## Methods

### `getAllPanels()`

**Return value:** `IPanel[]<IPanel>`

Returns a list of all panels on this page.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `visibleOnly` | `boolean` | A Boolean value that specifies whether to include only visible panels. |
| `includingDesignTime` | `boolean` | For internal use. |

### `scrollToTop()`

Scrolls this page to the top.
