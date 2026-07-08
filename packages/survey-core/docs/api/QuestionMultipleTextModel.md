---
title: QuestionMultipleTextModel
product: Form Library
api-type: class
description: "A class that describes the Multiple Text question type. [View Demo](https://surveyjs.io/form-library/examples/questiontype-multipletext/ (linkStyle))"
source: 
---

# `QuestionMultipleTextModel`

A class that describes the Multiple Text question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-multipletext/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionMultipleTextModel`

## Properties

### `isAllowTitleLeft`

**Type**: `boolean`

### `isContainer`

**Type**: `boolean`

### `items`

Gets or sets an array of [`MultipleTextItemModel`](https://surveyjs.io/form-library/documentation/api-reference/multipletextitemmodel) objects that represent input items.

Each object in this array should have at least the following properties:

```js
{
  "name": any, // A unique value used to identify an input item and save an item value to survey results.
  "title": string // An item caption. When `title` is undefined, `name` is used. This property supports Markdown.
}
```

To enable Markdown support for the `title` property, implement Markdown-to-HTML conversion in the [`onTextMarkdown`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onTextMarkdown) event handler. For an example, refer to the following demo: [Convert Markdown to HTML with markdown-it](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/).

[View Demo](https://surveyjs.io/form-library/examples/multiple-text-box-question/ (linkStyle))

**Type**: `MultipleTextItemModel[]`

### `itemErrorLocation`

Specifies the error message position relative to individual input fields.

Possible values:

- `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
- `"top"` - Displays error messages above input fields.
- `"bottom"` - Displays error messages below input fields.

**Type**: `string`

### `showItemErrorOnTop`

**Type**: `boolean`

### `showItemErrorOnBottom`

**Type**: `boolean`

### `colCount`

The number of columns used to arrange input items. Accepts the following values: 1, 2, 3, 4, 5.

Default value: 1

**Type**: `number`

### `inputSize`

A value passed on to the [`inputSize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size) attribute of the underlying `<input>` elements.

**Type**: `number`

### `itemSize`

**Type**: `number`

### `itemTitleWidth`

Specifies a uniform width for all text box titles. Accepts CSS values.

Default value: `""` (the width of each title depends on the title length)

**Type**: `string`

### `rows`

**Type**: `MutlipleTextRow[]`

### `isMultipleItemValueChanging`

**Type**: `boolean`

### `ariaRole`

**Type**: `string`

### `ariaRequired`

**Type**: `any`

### `ariaInvalid`

**Type**: `any`

## Methods

### `addDefaultItems()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `QuestionMultipleTextModel` |  |

### `getType()`

**Return value:** `string`

### `setSurveyImpl()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `ISurveyImpl` |  |
| `isLight` | `boolean` |  |

### `addItem()`

Adds a new input item.

**Return value:** `MultipleTextItemModel`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | An item name. |
| `title` | `string` | *(Optional)* An item title. |

### `getItemByName()`

**Return value:** `MultipleTextItemModel`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `getElementsInDesign()`

**Return value:** `IElement[]<IElement>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `includeHidden` | `boolean` |  |

### `addConditionObjectsByContext()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `objects` | `IConditionObject[]` |  |
| `context` | `any` |  |

### `getConditionJson()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `operator` | `string` |  |
| `path` | `string` |  |

### `locStrsChanged()`

### `localeChanged()`

### `getQuestionErrorLocation()`

**Return value:** `string`

### `getChildErrorLocation()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `child` | `Question` |  |

### `getRows()`

**Return value:** `any[]<any>`

### `getAllErrors()`

**Return value:** `SurveyError[]<SurveyError>`

### `clearErrors()`

### `getProgressInfo()`

**Return value:** `IProgressInfo`

### `getValueGetterContext()`

**Return value:** `IValueGetterContext`

### `getItemLabelCss()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `MultipleTextItemModel` |  |

### `getItemCss()`

**Return value:** `string`

### `getItemTitleCss()`

**Return value:** `string`
