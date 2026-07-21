---
title: PanelModelBase
product: Form Library
api-type: class
description: A base class for the `PanelModel` and `PageModel` classes.
source: https://surveyjs.io/form-library/documentation/api-reference/panelmodelbase
---

# `PanelModelBase`

A base class for the [`PanelModel`](https://surveyjs.io/form-library/documentation/panelmodel) and [`PageModel`](https://surveyjs.io/form-library/documentation/pagemodel) classes.

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; `PanelModelBase`

## Properties

### `areQuestionsRandomized`

**Type**: `boolean`

Returns `true` if elements in this panel/page are arranged in random order.

**Related APIs:** [`questionOrder`](#questionOrder)

### `elements`

**Type**: `IElement[]`

An array of all survey elements (questions or panels) within this panel/page. Does not include questions within nested panels.

**Related APIs:** [`questions`](#questions)

### `enableIf`

**Type**: `string`

A Boolean expression. If it evaluates to `false`, this panel/page becomes read-only.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Related APIs:** [`readOnly`](#readOnly), [`isReadOnly`](#isReadOnly)

### `gridLayoutColumns`

**Type**: `PanelLayoutColumnModel[]`

An array of columns used to arrange survey elements within this page or panel. Applies only if you set the `SurveyModel`'s [`gridLayoutEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#gridLayoutEnabled) property to `true`.

Each object in this array configures a single layout column and has the following properties:

- `width`: `number`\
Column width, in percentage.

- `questionTitleWidth`: `string`\
The width of question titles, in pixels.

The `gridLayoutColumns` array is generated automatically based on the maximum number of questions and panels in the same row. To arrange the survey elements in one or several rows, disable the [`startWithNewLine`](https://surveyjs.io/form-library/documentation/api-reference/question#startWithNewLine) property for those elements that should occupy the same row as the previous question or panel. You can also set the [`colSpan`](https://surveyjs.io/form-library/documentation/api-reference/question#colSpan) property for individual questions and panels to specify how many layout columns they span.

### `id`

**Type**: `string`

An auto-generated unique element identifier.

### `isRequired`

**Type**: `boolean`

Makes the panel/page require an answer at least in one nested question. If a respondent leaves the panel/page without any answers, the survey displays a validation error.

**Related APIs:** [`requiredIf`](#requiredIf), [`Data Validation`](https://surveyjs.io/form-library/documentation/data-validation)

### `isVisible`

**Type**: `boolean`

Returns `true` if the panel/page is visible or the survey is currently in design mode.

If you want to display or hide a question based on a condition, specify the `visibleIf` property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Related APIs:** [`visibleIf`](#visibleIf), [`visible`](#visible)

### `parent`

**Type**: `PanelModelBase`

Returns a survey element (panel or page) that contains this panel and allows you to move the panel to a different survey element.

For `PageModel` objects, the `parent` property is `null`, except in the following cases:

- `SurveyModel`'s [`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) is set to `"singlePage"`.
- The page is included in a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).

In those cases, the survey creates an internal `PageModel` object to show all questions on one page, and the `parent` property contains this object.

### `questionErrorLocation`

**Type**: `string`

Specifies the error message position for questions that belong to this page/panel.

Use this property to override the [`questionErrorLocation`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionErrorLocation) property specified for the survey. You can also set the [`errorLocation`](https://surveyjs.io/form-library/documentation/question#errorLocation) property for individual questions.

Possible values:

- `"default"` (default) - Inherits the setting from the `questionErrorLocation` property specified for the survey.
- `"top"` - Displays error messages above questions.
- `"bottom"` - Displays error messages below questions.

[View Demo](https://surveyjs.io/form-library/examples/set-properties-on-multiple-questions-using-panel/ (linkStyle))

### `questionOrder`

**Type**: `string`

Specifies the sort order of questions in the panel/page.

Possible values:

- `"initial"` - Preserves the original order of questions.
- `"random"` - Displays questions in random order.
- `"default"` (default) - Inherits the setting from the `SurveyModel`'s [`questionOrder`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionOrder) property.

**Related APIs:** [`areQuestionsRandomized`](#areQuestionsRandomized)

### `questions`

**Type**: `Question[]`

An array of all questions within this panel/page. Includes questions within nested panels.

**Related APIs:** [`elements`](#elements)

### `questionStartIndex`

**Type**: `string`

Specifies a number or letter used to start numbering of elements inside this page/panel.

You can include desired prefixes and postfixes alongside the number or letter:

```js
"questionStartIndex": "a.", // a., b., c., ...
"questionStartIndex": "#3", // #3, #4, #5, ...
"questionStartIndex": "(B)." // (B)., (C)., (D)., ...
```
Default value: `"1."` (inherited from the `questionStartIndex` property specified for the parent panel, page, or survey)

**Related APIs:** [`showQuestionNumbers`](#showQuestionNumbers)

### `questionTitleLocation`

**Type**: `string`

Sets a title location relative to the input field for questions that belong to this panel/page.

Use this property to override the [`questionTitleLocation`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionTitleLocation) property specified for the survey or parent page. You can also set the [`titleLocation`](https://surveyjs.io/form-library/documentation/api-reference/question#titleLocation) property for individual questions.

Possible values:

- `"default"` (default) - Inherits the setting from the `questionTitleLocation` property specified for the survey or parent page.
- `"top"` - Displays the title above the input field.
- `"bottom"` - Displays the title below the input field.
- `"left"` - Displays the title to the left of the input field.
- `"hidden"` - Hides the question title.

[View Demo](https://surveyjs.io/form-library/examples/vertically-align-input-fields/ (linkStyle))

> Certain question types (Matrix, Multiple Text) do not support the `"left"` value. For them, the `"top"` value is used.

### `questionTitleWidth`

**Type**: `string`

Sets consistent width for question titles in CSS values. Applies only when [`questionTitleLocation`](#questionTitleLocation) evaluates to `"left"`.

Default value: `undefined`

[View Demo](https://surveyjs.io/form-library/examples/vertically-align-input-fields/ (linkStyle))

### `requiredErrorText`

**Type**: `string`

Specifies a custom error message for a required panel/page.

**Related APIs:** [`isRequired`](#isRequired), [`requiredIf`](#requiredIf)

### `requiredIf`

**Type**: `string`

A Boolean expression. If it evaluates to `true`, this panel/page becomes required (at least one question in the panel/page should have an answer).

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Related APIs:** [`isRequired`](#isRequired)

### `requiredMark`

**Type**: `string`

Returns a character or text string that indicates a required panel/page.

Available since: v2.0.0

**Related APIs:** [`SurveyModel.requiredMark`](#SurveyModel.requiredMark), [`isRequired`](#isRequired)

### `visible`

**Type**: `boolean`

Gets or sets panel/page visibility.

If you want to display or hide a survey element based on a condition, specify the `visibleIf` property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Related APIs:** [`visibleIf`](#visibleIf), [`isVisible`](#isVisible)

### `visibleIf`

**Type**: `string`

A Boolean expression. If it evaluates to `false`, this panel/page becomes hidden.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Related APIs:** [`visible`](#visible), [`isVisible`](#isVisible)

## Methods

### `addElement()`

**Return value:** `boolean`

Adds a survey element (question or panel) to this panel/page. Returns `true` if the element was added successfully; `false` otherwise.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `IElement` | A survey element to add. |
| `index` | `number` | A desired index of this element in the `elements` array. |

**Related APIs:** [`addNewQuestion`](#addNewQuestion), [`addNewPanel`](#addNewPanel)

### `addNewPanel()`

**Return value:** `PanelModel`

Creates a new panel and adds it to the end of the `elements` array.

This method returns `null` if the panel cannot be created or added to this panel/page; otherwise, the method returns the created panel.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A panel name. |

**Related APIs:** [`elementsup`](#elementsup), [`addElement`](#addElement)

### `addNewQuestion()`

**Return value:** `Question`

Creates a new question of a given type and adds it to the `elements` array at a specified index.

This method returns `null` if the question cannot be created or added to this panel/page; otherwise, the method returns the created question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questionType` | `string` | A [question type](https://surveyjs.io/form-library/documentation/question#getType). |
| `name` | `string` | A question name. |
| `index` | `number` | A desired index of the new question in the `elements` array. |

**Related APIs:** [`elements`](#elements), [`addElement`](#addElement)

### `clearErrors()`

Empties the `errors` array for this panel/page and all its child elements (panels and questions).

**Related APIs:** [`errors`](#errors)

### `clearIncorrectValues()`

Removes values that cannot be assigned to nested questions, for example, choices unlisted in the `choices` array.

Call this method after you assign new question values in code to ensure that they are acceptable.

> This method does not remove values for invisible questions and values that fail validation. Call the `validate()` method to validate newly assigned values.

**Related APIs:** [`validate`](#validate)

### `containsElement()`

**Return value:** `boolean`

Checks whether a given element belongs to this panel/page or nested panels.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `IElement` | A survey element to check. |

### `focusFirstErrorQuestion()`

Focuses the first question with a validation error in this panel/page.

**Related APIs:** [`validate`](#validate), [`focusFirstQuestion`](#focusFirstQuestion)

### `focusFirstQuestion()`

Focuses the first question in this panel/page.

**Related APIs:** [`focusFirstErrorQuestion`](#focusFirstErrorQuestion)

### `getComments()`

**Return value:** `any`

Returns a JSON object with comments left to questions within this panel/page. Question names are used as keys.

### `getDisplayValue()`

**Return value:** `any`

Returns a JSON object with display texts that correspond to question values nested in the panel/page.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `keysAsText` | `boolean` | Pass `true` if not only values in the object should be display texts, but also keys. Default value: `false`. |

**Related APIs:** [`getValue`](#getValue)

### `getElementByName()`

**Return value:** `IElement`

Returns a survey element with a specified `name`. This method can find survey elements within nested panels.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | An element name. |

### `getQuestionByName()`

**Return value:** `Question`

Returns a question with a specified `name`. This method does not find questions within nested panels.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A question name. |

### `getValue()`

**Return value:** `any`

Returns a JSON object with question values nested in the panel/page.

**Related APIs:** [`getDisplayValue`](#getDisplayValue)

### `removeElement()`

**Return value:** `boolean`

Deletes a survey element (question or panel) from this panel/page. Returns `true` if the element was deleted successfully; `false` otherwise.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `IElement` | A survey element to delete. |

**Related APIs:** [`elements`](#elements)

### `validate()`

**Return value:** `boolean`

Validates questions within this panel or page and returns `false` if the validation fails.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fireCallback` | `boolean` | *(Optional)* Pass `false` if you do not want to show validation errors in the UI. |
| `focusFirstError` | `boolean` | *(Optional)* Pass `true` if you want to focus the first question with a validation error. |
| `callbackResult` | `(res: boolean, question: Question) => void` |  |

**Related APIs:** [`Data Validation`](https://surveyjs.io/form-library/documentation/data-validation)
