---
title: PanelModel
product: Form Library
api-type: class
description: A class that describes the Panel container element.
source: https://surveyjs.io/form-library/documentation/api-reference/panelmodel
---

# `PanelModel`

A class that describes the Panel container element.

A panel can contain questions and other panels. Refer to the following help topic for an illustration: [Survey Structure](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#survey-structure).

[View Demo](https://surveyjs.io/form-library/examples/questiontype-panel/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`PanelModelBase`](https://surveyjs.io/form-library/documentation/api-reference/panelmodelbase.md) &rarr; `PanelModel`

## Properties

### `innerIndent`

**Type**: `number`

Increases or decreases an indent of panel content from the left edge. Accepts positive integer values and 0.

### `no`

**Type**: `string`

A question number or letter (depends on the `questionStartIndex` property).

When the question number, title, or the entire question is invisible, this property returns an empty string.

**Related APIs:** [`questionStartIndex`](#questionStartIndex), [`showNumber`](#showNumber), [`visibleIf`](#visibleIf)

### `page`

**Type**: `IPage`

Returns a page to which the panel belongs and allows you to move this panel to a different page.

**Related APIs:** [`PanelModelBase.parent`](#PanelModelBase.parent)

### `showNumber`

**Type**: `boolean`

Specifies whether to show the panel number in the title.

Default value: `false`

**Related APIs:** [`SurveyModel.showQuestionNumbers`](#SurveyModel.showQuestionNumbers), [`SurveyModel.questionTitlePattern`](#SurveyModel.questionTitlePattern)

### `showQuestionNumbers`

**Type**: `string`

Specifies whether to display survey element numbers within this page/panel and how to calculate them.

Possible values:

- `"default"` - Inherits the setting from the parent panel, page, or survey.
- `"recursive"` - Applies recursive numbering to elements nested within this page/panel (for example, 1 -> 1.1 -> 1.1.1, etc.).
- `"onpanel"` - Starts numbering within this page/panel from scratch.
- `"off"` - Hides question numbers within this page/panel.

**Related APIs:** [`SurveyModel.showQuestionNumbers`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#showQuestionNumbers), [`showNumber`](#showNumber), [`questionStartIndex`](#questionStartIndex)

### `startWithNewLine`

**Type**: `boolean`

Disable this property if you want to render the current panel on the same line or row with the previous question or panel.

[View Demo](https://surveyjs.io/form-library/examples/arrange-multiple-questions-in-single-line/ (linkStyle))

### `visibleIndex`

**Type**: `number`

Returns the visible index of the panel in the survey. Commonly it is -1 and it doesn't show.
You have to set showNumber to true to show index/numbering for the Panel

**Related APIs:** [`showNumber`](#showNumber)

## Methods

### `expand()`

Expands the panel.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `focusFirstQuestion` | `boolean` | Specifies whether to focus the first question within the expanded panel. Default value: `true`. |

**Related APIs:** [`state`](#state), [`toggleState`](#toggleState), [`collapse`](#collapse), [`isCollapsed`](#isCollapsed), [`isExpanded`](#isExpanded)
