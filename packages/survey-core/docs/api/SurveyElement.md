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

Specifies how many columns this survey element spans in the grid layout. Applies only if you set the `SurveyModel`'s [`gridLayoutEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#gridLayoutEnabled) property to `true` and define the [`gridLayoutColumns`](https://surveyjs.io/form-library/documentation/api-reference/page-model#gridLayoutColumns) array for the parent page or panel.

Default value: 1

**Type**: `number`

### `containsErrors`

Returns `true` if the survey element or its child elements have validation errors.

This property contains the result of the most recent validation. This result may be outdated. Call the `validate` method to get an up-to-date value.

**Type**: `boolean`

### `cssClasses`

Returns an object in which keys are UI elements and values are CSS classes applied to them.

Use the following events of the [`SurveyModel`](https://surveyjs.io/form-library/documentation/surveymodel) object to override CSS classes:

- [`onUpdateQuestionCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdateQuestionCssClasses)
- [`onUpdatePanelCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdatePanelCssClasses)
- [`onUpdatePageCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdatePageCssClasses)
- [`onUpdateChoiceItemCss`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUpdateChoiceItemCss)

[View Demo](https://surveyjs.io/form-library/examples/customize-survey-with-css/ (linkStyle))

**Type**: `any`

### `errors`

Validation errors. Call the `validate()` method to validate survey element data.

**Type**: `SurveyError[]`

### `indent`

Increases or decreases an indent of survey element content from the left edge. Accepts positive integer values and 0.

**Type**: `number`

### `isCollapsed`

Returns `true` if the survey element is collapsed.

**Type**: `boolean`

### `isExpanded`

Returns `true` if the survey element is expanded.

**Type**: `boolean`

### `isReadOnly`

Returns `true` if the survey element or its parent element is read-only.

If you want to switch a survey element to the read-only state based on a condition, specify the [`enableIf`](https://surveyjs.io/form-library/documentation/question#enableIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `boolean`

### `maxWidth`

Gets or sets maximum survey element width in CSS values.

Default value: "100%" (taken from [`settings.maxWidth`](https://surveyjs.io/form-library/documentation/settings#maxWidth))

**Type**: `string`

### `minWidth`

Gets or sets minimum survey element width in CSS values.

Default value: "300px" (taken from [`settings.minWidth`](https://surveyjs.io/form-library/documentation/settings#minWidth))

**Type**: `string`

### `name`

A survey element identifier.

> Question names must be unique.

**Type**: `string`

### `parentQuestion`

A Dynamic Panel, Dynamic Matrix, or Dropdown Matrix that includes the current question.

This property is `null` for standalone questions.

**Type**: `E`

### `readOnly`

Makes the survey element read-only.

If you want to switch a survey element to the read-only state based on a condition, specify the [`enableIf`](https://surveyjs.io/form-library/documentation/question#enableIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `boolean`

### `renderWidth`

Returns a calculated width of the rendered survey element in CSS values.

**Type**: `string`

### `state`

Gets and sets the survey element's expand state.

Possible values:

- `"default"` (default) - The survey element is displayed in full and cannot be collapsed in the UI.
- `"expanded"` - The survey element is displayed in full and can be collapsed in the UI.
- `"collapsed"` - The survey element displays only `title` and `description` and can be expanded in the UI.

[View Demo](https://surveyjs.io/form-library/examples/set-properties-on-multiple-questions-using-panel/ (linkStyle))

**Type**: `string`

### `survey`

Returns the survey object.

**Type**: `ISurvey`

### `width`

Sets survey element width in CSS values.

Default value: ""

**Type**: `string`

## Methods

### `collapse()`

Collapses the survey element.

In collapsed state, the element displays only `title` and `description`.

### `expand()`

Expands the survey element.

### `getLocale()`

Returns the survey's [locale](https://surveyjs.io/form-library/documentation/surveymodel#locale).

If a default locale is used, this method returns an empty string. To get the applied locale in this case, use the following code:

```js
import { surveyLocalization } from 'survey-core';
const defaultLocale = surveyLocalization.defaultLocale;
```

**Return value:** `string`

### `toggleState()`

Toggles the survey element's `state` between collapsed and expanded.

**Return value:** `boolean`
