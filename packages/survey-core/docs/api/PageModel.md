---
title: PageModel
product: Form Library
api-type: class
description: "The `PageModel` object describes a survey page and contains properties and methods that allow you to control the page and access its elements (panels and questions). [View Demo](https://surveyjs.io/form-library/examples/nps-question/ (linkStyle))"
source: 
---

# `PageModel`

The `PageModel` object describes a survey page and contains properties and methods that allow you to control the page and access its elements (panels and questions).

[View Demo](https://surveyjs.io/form-library/examples/nps-question/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `PanelModelBase` &rarr; `PanelModel` &rarr; `PageModel`

## Properties

### `isPageContainer`

**Type**: `boolean`

### `isPage`

**Type**: `boolean`

### `isPanel`

**Type**: `boolean`

### `showPanelAsPage`

**Type**: `boolean`

### `hasEditButton`

**Type**: `boolean`

### `no`

**Type**: `string`

### `cssTitleNumber`

**Type**: `string`

### `cssRequiredMark`

**Type**: `string`

### `navigationTitle`

A caption displayed on a navigation button in the TOC or progress bar. Applies when [`showTOC`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showTOC) is `true` or when the [progress bar is visible](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showProgressBar), [`progressBarType`](https://surveyjs.io/form-library/documentation/surveymodel#progressBarType) is set to `"pages"`, and [`progressBarShowPageTitles`](https://surveyjs.io/form-library/documentation/surveymodel#progressBarShowPageTitles) is `true`.

[Table of Contents Demo](https://surveyjs.io/form-library/examples/table-of-contents/ (linkStyle))

[Progress Bar Demo](https://surveyjs.io/form-library/examples/configure-form-navigation-with-progress-indicators/ (linkStyle))

> If navigation titles are unspecified, the navigation buttons display page [titles](https://surveyjs.io/form-library/documentation/api-reference/page-model#title) or [names](https://surveyjs.io/form-library/documentation/pagemodel#name).

**Type**: `string`

### `navigationDescription`

**Type**: `string`

### `passed`

**Type**: `boolean`

### `visibleIndex`

The visible index of the page. It has values from 0 to visible page count - 1.

**Type**: `number`

### `isStartPage`

Returns `true` if this page is a start page.

Refer to the following help topic for more information on how to configure a start page: [Start Page](https://surveyjs.io/form-library/documentation/design-survey-create-a-multi-page-survey#start-page).

**Type**: `boolean`

### `isStarted`

**Type**: `boolean`

### `cssRoot`

**Type**: `string`

### `num`

**Type**: `number`

### `navigationButtonsVisibility`

**Type**: `string`

### `showNavigationButtons`

Gets or sets the visibility of the Start, Next, Previous, and Complete navigation buttons on this page. Overrides the [`showNavigationButtons`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showNavigationButtons) property specified on the survey-level.

Default value: `undefined` (the visibility depends on the survey-level setting)

**Type**: `string | boolean`

### `isActive`

Returns `true` if this is the current page.

**Type**: `boolean`

### `wasShown`

Returns `true` if the respondent has already seen this page during the current session.

**Type**: `boolean`

### `timeSpent`

A time period that a respondent has spent on this page so far; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

**Type**: `number`

### `timeLimit`

A time period that a respondent has to complete this page; measured in seconds. Applies only to [quiz surveys](https://surveyjs.io/form-library/documentation/design-survey-create-a-quiz).

Default value: 0 (time is unlimited)

Alternatively, you can use the `SurveyModel`'s [`timeLimitPerPage`](https://surveyjs.io/form-library/documentation/surveymodel#timeLimitPerPage) property to specify identical time periods for all survey pages.

**Type**: `number`

### `maxTimeToFinish`

**Type**: `number`

### `_isReadyForClean`

**Type**: `boolean`

### `isReadyForClean`

**Type**: `boolean`

### `isReadyForCleanChangedCallback`

**Type**: `() => void`

## Methods

### `getType()`

**Return value:** `string`

### `toString()`

**Return value:** `string`

### `getOwner()`

**Return value:** `any`

### `getTemplate()`

**Return value:** `string`

### `getPanelInDesignMode()`

**Return value:** `PanelModel`

### `addNoFromChild()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `no` | `string` |  |

### `getCssTitleExpandableSvg()`

**Return value:** `string`

### `navigationLocStrChanged()`

### `setShowNavigationButtonsProperty()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `string \| boolean` |  |

### `setWasShown()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `boolean` |  |

### `scrollToTop()`

Scrolls this page to the top.

### `getAllPanels()`

Returns a list of all panels on this page.

**Return value:** `IPanel[]<IPanel>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `visibleOnly` | `boolean` | A Boolean value that specifies whether to include only visible panels. |
| `includingDesignTime` | `boolean` | For internal use. |

### `getPanels()`

**Return value:** `IPanel[]<IPanel>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `visibleOnly` | `boolean` |  |
| `includingDesignTime` | `boolean` |  |

### `getMaxTimeToFinish()`

**Return value:** `number`

### `ensureRowsVisibility()`

### `enableOnElementRerenderedEvent()`

### `disableOnElementRerenderedEvent()`
