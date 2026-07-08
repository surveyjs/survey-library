---
title: SurveyElement
product: Form Library
api-type: class
description: A base class for all survey elements.
source: https://surveyjs.io/form-library/documentation/api-reference/surveyelement
---

# `SurveyElement`

A base class for all survey elements.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement`

## Properties

### `colSpan`

**Type**: `number`

Specifies how many columns this survey element spans in the grid layout. Applies only if you set the `SurveyModel`'s [`gridLayoutEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#gridLayoutEnabled) property to `true` and define the [`gridLayoutColumns`](https://surveyjs.io/form-library/documentation/api-reference/page-model#gridLayoutColumns) array for the parent page or panel.

Default value: 1

### `containsErrors`

**Type**: `boolean`

Returns `true` if the survey element or its child elements have validation errors.

This property contains the result of the most recent validation. This result may be outdated. Call the `validate` method to get an up-to-date value.

### `cssClasses`

**Type**: `any`

Returns an object in which keys are UI elements and values are CSS classes applied to them.

Use the following events of the [`SurveyModel`](https://surveyjs.io/form-library/documentation/surveymodel) object to override CSS classes:

- [`onUpdateQuestionCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdateQuestionCssClasses)
- [`onUpdatePanelCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdatePanelCssClasses)
- [`onUpdatePageCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdatePageCssClasses)
- [`onUpdateChoiceItemCss`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUpdateChoiceItemCss)

[View Demo](https://surveyjs.io/form-library/examples/customize-survey-with-css/ (linkStyle))

### `errors`

**Type**: `SurveyError[]`

Validation errors. Call the `validate()` method to validate survey element data.

### `indent`

**Type**: `number`

Increases or decreases an indent of survey element content from the left edge. Accepts positive integer values and 0.

### `isCollapsed`

**Type**: `boolean`

Returns `true` if the survey element is collapsed.

### `isExpanded`

**Type**: `boolean`

Returns `true` if the survey element is expanded.

### `isReadOnly`

**Type**: `boolean`

Returns `true` if the survey element or its parent element is read-only.

If you want to switch a survey element to the read-only state based on a condition, specify the [`enableIf`](https://surveyjs.io/form-library/documentation/question#enableIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

### `maxWidth`

**Type**: `string`

Gets or sets maximum survey element width in CSS values.

Default value: "100%" (taken from [`settings.maxWidth`](https://surveyjs.io/form-library/documentation/settings#maxWidth))

### `minWidth`

**Type**: `string`

Gets or sets minimum survey element width in CSS values.

Default value: "300px" (taken from [`settings.minWidth`](https://surveyjs.io/form-library/documentation/settings#minWidth))

### `name`

**Type**: `string`

A survey element identifier.

> Question names must be unique.

### `parentQuestion`

**Type**: `E`

A Dynamic Panel, Dynamic Matrix, or Dropdown Matrix that includes the current question.

This property is `null` for standalone questions.

### `readOnly`

**Type**: `boolean`

Makes the survey element read-only.

If you want to switch a survey element to the read-only state based on a condition, specify the [`enableIf`](https://surveyjs.io/form-library/documentation/question#enableIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

### `renderWidth`

**Type**: `string`

Returns a calculated width of the rendered survey element in CSS values.

### `state`

**Type**: `string`

Gets and sets the survey element's expand state.

Possible values:

- `"default"` (default) - The survey element is displayed in full and cannot be collapsed in the UI.
- `"expanded"` - The survey element is displayed in full and can be collapsed in the UI.
- `"collapsed"` - The survey element displays only `title` and `description` and can be expanded in the UI.

[View Demo](https://surveyjs.io/form-library/examples/set-properties-on-multiple-questions-using-panel/ (linkStyle))

### `survey`

**Type**: `ISurvey`

Returns the survey object.

### `width`

**Type**: `string`

Sets survey element width in CSS values.

Default value: ""

## Methods

### `collapse()`

Collapses the survey element.

In collapsed state, the element displays only `title` and `description`.

### `expand()`

Expands the survey element.

### `getLocale()`

**Return value:** `string`

Returns the survey's [locale](https://surveyjs.io/form-library/documentation/surveymodel#locale).

If a default locale is used, this method returns an empty string. To get the applied locale in this case, use the following code:

```js
import { surveyLocalization } from 'survey-core';
const defaultLocale = surveyLocalization.defaultLocale;
```

### `toggleState()`

**Return value:** `boolean`

Toggles the survey element's `state` between collapsed and expanded.
