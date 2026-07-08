---
title: QuestionDropdownModel
product: Form Library
api-type: class
description: "A class that describes the Dropdown question type. [View Demo](https://surveyjs.io/form-library/examples/questiontype-dropdown/ (linkStyle))"
source: 
---

# `QuestionDropdownModel`

A class that describes the Dropdown question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-dropdown/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionDropdownModel`

## Properties

### `lastSelectedItemValue`

**Type**: `ItemValue`

### `showOptionsCaption`

**Type**: `boolean`

### `optionsCaption`

**Type**: `string`

### `placeholder`

A placeholder for the input field.

**Type**: `string`

### `isNewA11yStructure`

**Type**: `boolean`

### `a11yQuestionAriaRole`

**Type**: `string`

### `a11yInputAriaRole`

**Type**: `string`

### `selectedItem`

Returns the selected choice item. If no item is selected, returns `null`.

**Type**: `ChoiceItem`

### `isShowingChoiceComment`

**Type**: `boolean`

### `minMaxChoices`

**Type**: `ItemValue[]`

### `choicesMin`

Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].

```js
"choicesMin": 10,
"choicesMax": 30
"choicesStep": 10
```

**Type**: `number`

### `choicesMax`

Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].

```js
"choicesMin": 10,
"choicesMax": 30
"choicesStep": 10
```

**Type**: `number`

### `choicesStep`

Use the `choicesMin`, `choicesMax`, and `choicesStep` properties to generate choice items automatically. For example, the configuration below generates three choice items: [10, 20, 30].

```js
"choicesMin": 10,
"choicesMax": 30
"choicesStep": 10
```

The default value of the `choicesStep` property is 1.

**Type**: `number`

### `autocomplete`

**Type**: `string`

### `allowClear`

Specifies whether to display a button that clears the selected value.

**Type**: `boolean`

### `searchEnabled`

Specifies whether users can enter a value into the input field to filter the drop-down list.

[View Demo](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/ (linkStyle))

**Type**: `boolean`

### `searchMode`

Specifies a comparison operation used to filter the drop-down list. Applies only if [`searchEnabled`](#searchEnabled) is `true`.

Possible values:

- `"contains"` (default)
- `"startsWith"`

**Type**: `"contains" | "startsWith"`

### `allowCustomChoices`

Specifies whether users can add their own choices if the desired option isn't available in the dropdown.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/dropdown-custom-choice-options/ (linkStyle))

> Custom choices will only be stored temporarily for the duration of the current browser session. If you want to save them in a database or another data storage, handle the [`onCreateCustomChoiceItem`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCreateCustomChoiceItem) event.

**Type**: `boolean`

### `createCustomChoiceText`

Specifies the text displayed for the command that creates a custom choice. Applies only when [`allowCustomChoices`](#allowCustomChoices) is `true`.

Default value: `"Create \"{0}\" item..."`

**Type**: `string`

### `textWrapEnabled`

Specifies whether to wrap long texts in choice options onto a new line.

Default value: `true`

Disable this property if you want the texts to be truncated with ellipsis.

**Type**: `boolean`

### `inputHasValue`

**Type**: `boolean`

### `choicesLazyLoadEnabled`

Enables lazy loading. If you set this property to `true`, you should implement the Survey's [`onChoicesLazyLoad`](https://surveyjs.io/form-library/documentation/surveymodel#onChoicesLazyLoad) event handler.

**Type**: `boolean`

### `choicesLazyLoadPageSize`

Specifies the number of choice items to load at a time when choices are loaded on demand.

Default value: 25

> This property does not accept values below 25 to prevent the server from being flooded with requests.

**Type**: `number`

### `suggestedItem`

**Type**: `ItemValue`

### `selectedItemLocText`

**Type**: `LocalizableString`

### `inputFieldComponentName`

**Type**: `string`

### `showSelectedItemLocText`

**Type**: `boolean`

### `showInputFieldComponent`

**Type**: `boolean`

### `dropdownListModel`

**Type**: `DropdownListModel`

## Methods

### `locStrsChanged()`

### `getType()`

**Return value:** `string`

### `getControlClass()`

**Return value:** `string`

### `getInputId()`

**Return value:** `string`

### `afterRenderCore()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |
