---
title: PanelModel
product: Form Library
api-type: class
description: "A class that describes the Panel container element. A panel can contain questions and other panels. Refer to the following help topic for an illustration: [Survey Structure](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#survey-structure). [View Demo](https://surveyjs.io/form-library/examples/questiontype-panel/ (linkStyle))"
source: 
---

# `PanelModel`

A class that describes the Panel container element.

A panel can contain questions and other panels. Refer to the following help topic for an illustration: [Survey Structure](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#survey-structure).

[View Demo](https://surveyjs.io/form-library/examples/questiontype-panel/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `PanelModelBase` &rarr; `PanelModel`

## Properties

### `contentId`

**Type**: `string`

### `isPanel`

**Type**: `boolean`

### `page`

Returns a page to which the panel belongs and allows you to move this panel to a different page.

**Type**: `IPage`

### `visibleIndex`

Returns the visible index of the panel in the survey. Commonly it is -1 and it doesn't show.
You have to set showNumber to true to show index/numbering for the Panel

**Type**: `number`

### `showNumber`

Specifies whether to show the panel number in the title.

Default value: `false`

**Type**: `boolean`

### `recursiveNoCallback`

**Type**: `() => string`

### `showQuestionNumbers`

Specifies whether to display survey element numbers within this page/panel and how to calculate them.

Possible values:

- `"default"` - Inherits the setting from the parent panel, page, or survey.
- `"recursive"` - Applies recursive numbering to elements nested within this page/panel (for example, 1 -> 1.1 -> 1.1.1, etc.).
- `"onpanel"` - Starts numbering within this page/panel from scratch.
- `"off"` - Hides question numbers within this page/panel.

**Type**: `string`

### `no`

A question number or letter (depends on the `questionStartIndex` property).

When the question number, title, or the entire question is invisible, this property returns an empty string.

**Type**: `string`

### `onGetNoCallback`

**Type**: `(no: string) => string`

### `innerIndent`

Increases or decreases an indent of panel content from the left edge. Accepts positive integer values and 0.

**Type**: `number`

### `startWithNewLine`

Disable this property if you want to render the current panel on the same line or row with the previous question or panel.

[View Demo](https://surveyjs.io/form-library/examples/arrange-multiple-questions-in-single-line/ (linkStyle))

**Type**: `boolean`

### `allowAdaptiveActions`

**Type**: `boolean`

### `innerPaddingLeft`

**Type**: `string`

### `footerActions`

**Type**: `IAction[]`

### `footerToolbarValue`

**Type**: `ActionContainer<Action>`

### `onGetFooterActionsCallback`

**Type**: `() => IAction[]`

### `onGetFooterToolbarCssCallback`

**Type**: `() => string`

### `hasEditButton`

**Type**: `boolean`

### `cssTitle`

**Type**: `string`

### `showErrorsAbovePanel`

**Type**: `boolean`

### `showPanelAsPage`

**Type**: `boolean`

### `forcusFirstQuestionOnExpand`

**Type**: `boolean`

## Methods

### `getType()`

**Return value:** `string`

### `getSurvey()`

**Return value:** `ISurvey`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `live` | `boolean` |  |

### `getOwner()`

**Return value:** `any`

### `moveTo()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `container` | `IPanel` |  |
| `insertBefore` | `any` |  |

### `getPanelInDesignMode()`

**Return value:** `PanelModel`

### `addNoFromChild()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `no` | `string` |  |

### `clearOnDeletingContainer()`

### `getFooterToolbar()`

**Return value:** `ActionContainer<Action>`

### `cancelPreview()`

### `getCssTitleExpandableSvg()`

**Return value:** `string`

### `needResponsiveWidth()`

**Return value:** `boolean`

### `focusIn()`

### `expand()`

Expands the panel.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `focusFirstQuestion` | `boolean` | Specifies whether to focus the first question within the expanded panel. Default value: `true`. |

### `getContainerCss()`

**Return value:** `string`

### `afterRenderCore()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `any` |  |
