---
title: QuestionPanelDynamicModel
product: Form Library
api-type: class
description: A class that describes the Dynamic Panel question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionpaneldynamicmodel
---

# `QuestionPanelDynamicModel`

A class that describes the Dynamic Panel question type.

Dynamic Panel allows respondents to add panels based on a panel template and delete them. Specify the [`templateElements`](https://surveyjs.io/form-library/documentation/questionpaneldynamicmodel#templateElements) property to configure panel template elements.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-paneldynamic/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionPanelDynamicModel`

## Properties

### `addPanelText`

A caption for the Add Panel button.

**Type**: `string`

### `allowAddPanel`

Specifies whether users are allowed to add new panels.

Default value: `true`

By default, users add new panels to the end. If you want to let users insert a new panel after the current panel, set the [`newPanelPosition`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#newPanelPosition) property to `"next"`.

**Type**: `boolean`

### `allowRemovePanel`

Specifies whether users are allowed to delete panels.

Default value: `true`

**Type**: `boolean`

### `canAddPanel`

Indicates whether it is possible to add a new panel.

This property returns `true` when all of the following conditions apply:

- Users are allowed to add new panels (`allowAddPanel` is `true`).
- Dynamic Panel or its parent survey is not in read-only state.
- `panelCount` is less than `maxPanelCount`.

**Type**: `boolean`

### `canRemovePanel`

Indicates whether it is possible to delete panels.

This property returns `true` when all of the following conditions apply:

- Users are allowed to delete panels (`allowRemovePanel` is `true`).
- Dynamic Panel or its parent survey is not in read-only state.
- `panelCount` exceeds `minPanelCount`.

**Type**: `boolean`

### `confirmDelete`

Specifies whether to display a confirmation dialog when a respondent wants to delete a panel.

[View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))

**Type**: `boolean`

### `confirmDeleteText`

A message displayed in a confirmation dialog that appears when a respondent wants to delete a panel.

**Type**: `string`

### `copyDefaultValueFromLastEntry`

Specifies whether default values for a new panel should be copied from the last panel.

If you also specify `defaultValue`, it will be merged with the copied values.

**Type**: `boolean`

### `currentIndex`

A zero-based index of the currently displayed panel.

When `displayMode` is `"list"` or Dynamic Panel is empty (`panelCount` is 0), this property contains -1.

**Type**: `number`

### `currentPanel`

A `PanelModel` object that is the currently displayed panel.

When `displayMode` is `"list"` or Dynamic Panel is empty (`panelCount` is 0), this property contains `null`.

**Type**: `PanelModel`

### `defaultPanelValue`

If it is not empty, then this value is set to every new panel, including panels created initially, unless the defaultValue is not empty

**Type**: `any`

### `displayMode`

Specifies how to display panels.

Possible values:

- `"list"` (default) - Displays panels one under the other. [View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/)
- `"carousel"` - Displays panels in a carousel. Users can switch between panels using navigation buttons.
- `"tab"` - Displays each panel within a tab. Use the [`templateTabTitle`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateTabTitle) to specify a template for tab titles. [View Demo](https://surveyjs.io/form-library/examples/tabbed-interface-for-duplicate-group-option/)

**Type**: `"list" | "carousel" | "tab"`

### `enableAddPanel`

Indicates whether the add panel button is enabled. When set to `false`, the button is disabled but remains visible.

Default value: `true`

This property is not serialized.

**Type**: `boolean`

### `enableRemovePanel`

Indicates whether the remove panel button is enabled. When set to `false`, the button is disabled but remains visible.

Default value: `true`

This property is not serialized.

**Type**: `boolean`

### `isNextButtonVisible`

Indicates whether the Next button is visible.

**Type**: `boolean`

### `isPrevButtonVisible`

Indicates whether the Previous button is visible.

**Type**: `boolean`

### `keyDuplicationError`

An error message displayed when users enter a duplicate value into a question that accepts only unique values (`isUnique` is set to `true` or `keyName` is specified).

A default value for this property is taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization). Refer to the following help topic for more information: [Localization & Globalization](https://surveyjs.io/form-library/documentation/localization).

**Type**: `string`

### `keyName`

Specifies a key question. Set this property to the name of a question used in the template, and Dynamic Panel will display `keyDuplicationError` if a user tries to enter a duplicate value in this question.

**Type**: `string`

### `maxPanelCount`

A maximum number of panels in Dynamic Panel. Users cannot add new panels if `panelCount` equals `maxPanelCount`.

Default value: 100 (inherited from [`settings.panel.maxPanelCount`](https://surveyjs.io/form-library/documentation/settings#panelMaximumPanelCount))

[View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))

**Type**: `number`

### `minPanelCount`

A minimum number of panels in Dynamic Panel. Users cannot delete panels if `panelCount` equals `minPanelCount`.

Default value: 0

**Type**: `number`

### `newPanelPosition`

Specifies the position of newly added panels.

Possible values:

- `"last"` (default) - New panels are added to the end.
- `"next"` - New panels are inserted after the current panel.

**Type**: `string`

### `nextPanelText`

A caption for the Next button. Applies only if `displayMode` is different from `"list"`.

**Type**: `string`

### `noEntriesText`

A text displayed when Dynamic Panel contains no entries.

**Type**: `string`

### `panelCount`

The number of panels in Dynamic Panel.

[View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))

**Type**: `number`

### `panels`

An array of `PanelModel` objects created based on a panel template.

**Type**: `PanelModel[]`

### `panelsState`

Specifies whether users can expand and collapse panels. Applies if `displayMode` is `"list"` and the `templateTitle` property is specified.

Possible values:

- `"default"` (default) - All panels are displayed in full and cannot be collapsed.
- `"expanded"` - All panels are displayed in full and can be collapsed in the UI.
- `"collapsed"` - All panels display only their titles and descriptions and can be expanded in the UI.
- `"firstExpanded"` - Only the first panel is displayed in full; other panels are collapsed and can be expanded in the UI.

**Type**: `string`

### `prevPanelText`

A caption for the Previous button. Applies only if `displayMode` is different from `"list"`.

**Type**: `string`

### `progressBarLocation`

Specifies the alignment of the [progress bar](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#showProgressBar) relative to the currently displayed panel. Applies only if [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) is `"carousel"`.

Possible values:

- `"top"` (default) - Displays the progress bar at the top of the current panel.
- `"bottom"` - Displays the progress bar at the bottom of the current panel.
- `"topBottom"` - Displays the progress bar at the top and bottom of the current panel.

**Type**: `"top" | "bottom" | "topBottom"`

### `questionStartIndex`

Specifies a number or letter used to start numbering of elements inside the dynamic panel.

You can include desired prefixes and postfixes alongside the number or letter:

```js
"questionStartIndex": "a.", // a., b., c., ...
"questionStartIndex": "#3", // #3, #4, #5, ...
"questionStartIndex": "(B)." // (B)., (C)., (D)., ...
```
Default value: `"1."` (inherited from the `questionStartIndex` property specified for the parent panel, page, or survey)

**Type**: `string`

### `removePanelButtonLocation`

Specifies the location of the Remove Panel button relative to panel content.

Possible values:

- `"bottom"` (default) - Displays the Remove Panel button below panel content.
- `"right"` - Displays the Remove Panel button to the right of panel content.

**Type**: `string`

### `removePanelText`

A caption for the Remove Panel button.

**Type**: `string`

### `showProgressBar`

Specifies whether to display the progress bar. Applies only if [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) is `"carousel"`.

Default value: `true`

**Type**: `boolean`

### `showQuestionNumbers`

Specifies whether to display survey element numbers within the dynamic panel and how to calculate them.

Possible values:

- `"off"` (default) - Hides question numbers.
- `"default"` - Inherits the setting from the parent panel, page, or survey.
- `"recursive"` - Applies recursive numbering to elements nested within the dynamic panel (for example, 1 -> 1.1 -> 1.1.1, etc.).
- `"onpanel"` - Starts numbering within the dynamic panel from scratch.
- `"onSurvey"` - Obsolete. Use the `"default"` value instead.

**Type**: `string`

### `tabTitlePlaceholder`

A placeholder for tab titles that applies when the [`templateTabTitle`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateTabTitle) expression doesn't produce a meaningful value.

Default value: `"New Panel"` (taken from a [localization dictionary](https://github.com/surveyjs/survey-library/tree/01bd8abd0c574719956d4d579d48c8010cd389d4/packages/survey-core/src/localization))

**Type**: `string`

### `template`

A `PanelModel` object used as a template to create dynamic panels.

**Type**: `PanelModel`

### `templateDescription`

A template for panel descriptions.

**Type**: `string`

### `templateElements`

An array of questions and panels included in a panel template.

[View Demo](https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/ (linkStyle))

**Type**: `IElement[]`

### `templateErrorLocation`

Specifies the error message position.

Possible values:

- `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
- `"top"` - Displays error messages above questions.
- `"bottom"` - Displays error messages below questions.

**Type**: `string`

### `templateQuestionTitleLocation`

Gets or sets the location of question titles relative to their input fields.

- `"default"` (default) - Inherits the setting from the Dynamic Panel's `titleLocation` property, which in turn inherits the [`questionTitleLocation`](https://surveyjs.io/form-library/documentation/surveymodel#questionTitleLocation) property value specified for the Dynamic Panel's container (page or survey).
- `"top"` - Displays question titles above input fields.
- `"bottom"` - Displays question titles below input fields.
- `"left"` - Displays question titles to the left of input fields.
- `"hidden"` - Hides question titles.

**Type**: `string`

### `templateQuestionTitleWidth`

Sets consistent width for question titles in CSS values. Applies only when [`templateQuestionTitleLocation`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#templateQuestionTitleLocation) evaluates to `"left"`.

Default value: `undefined` (inherits the actual value from the [`questionTitleWidth`](https://surveyjs.io/form-library/documentation/api-reference/page-model#questionTitleWidth) property of the parent panel or page.

**Type**: `string`

### `templateTabTitle`

A template for tab titles. Applies when [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) is `"tab"`.

The template can contain the following placeholders:

- `{panelIndex}` - A panel index within the collection of all panels. Starts with 1.
- `{visiblePanelIndex}` - A panel index within the collection of visible panels. Starts with 1.

If you want to customize individual tab titles, handle `SurveyModel`'s [`onGetDynamicPanelTabTitle`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onGetDynamicPanelTabTitle) event.

[View Demo](https://surveyjs.io/form-library/examples/tabbed-interface-for-duplicate-group-option/ (linkStyle))

**Type**: `string`

### `templateTitle`

A template for panel titles.

The template can contain the following placeholders:

- `{panelIndex}` - A panel index within the collection of all panels. Starts with 1.
- `{visiblePanelIndex}` - A panel index within the collection of visible panels. Starts with 1.

[View Demo](https://surveyjs.io/form-library/examples/breakable-loop/ (linkStyle))

**Type**: `string`

### `templateVisibleIf`

A Boolean expression that is evaluated against each panel. If the expression evaluates to `false`, the panel becomes hidden.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Use the `{panel}` placeholder to reference the current panel in the expression.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#conditional-visibility).

**Type**: `string`

### `visiblePanelCount`

Returns the number of visible panels in Dynamic Panel.

**Type**: `number`

### `visiblePanels`

An array of currently visible panels ([`PanelModel`](https://surveyjs.io/form-library/documentation/api-reference/panel-model) objects).

**Type**: `PanelModel[]`

## Methods

### `addPanel()`

Adds a new panel based on the [template](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#template).

**Return value:** `PanelModel`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `index` | `number` | *(Optional)* An index at which to insert the new panel. `undefined` adds the panel to the end or inserts it after the current panel if [`displayMode`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#displayMode) is `"tab"`. A negative index (for instance, -1) adds the panel to the end in all cases, regardless of the `displayMode` value. |
| `runAdditionalActions` | `boolean` | *(Optional)* Pass `true` if you want to perform additional actions: check whether a new panel [can be added](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#canAddPanel), expand and focus the new panel, and run animated effects. Default value: `false` (the listed actions are skipped). |

### `goToNextPanel()`

Switches Dynamic Panel to the next panel. Returns `true` in case of success, or `false` if `displayMode` is `"list"` or the current panel contains validation errors.

**Return value:** `boolean`

### `goToPrevPanel()`

Switches Dynamic Panel to the previous panel.

### `removePanel()`

Deletes a panel from the [`panels`](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#panels) array.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` | A `PanelModel` instance or zero-based panel index. |
| `confirmDelete` | `boolean` | *(Optional)* Pass `true` if you want to perform additional actions: check whether the panel [can be removed](https://surveyjs.io/form-library/documentation/api-reference/dynamic-panel-model#canRemovePanel) and display a confirmation dialog. |
