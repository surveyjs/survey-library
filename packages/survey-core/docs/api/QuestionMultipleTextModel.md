---
title: QuestionMultipleTextModel
product: Form Library
api-type: class
description: A class that describes the Multiple Text question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionmultipletextmodel
---

# `QuestionMultipleTextModel`

A class that describes the Multiple Text question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-multipletext/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionMultipleTextModel`

## Properties

### `colCount`

**Type**: `number`

The number of columns used to arrange input items. Accepts the following values: 1, 2, 3, 4, 5.

Default value: 1

### `inputSize`

**Type**: `number`

A value passed on to the [`inputSize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size) attribute of the underlying `<input>` elements.

### `itemErrorLocation`

**Type**: `string`

Specifies the error message position relative to individual input fields.

Possible values:

- `"default"` (default) - Inherits the setting from the [`errorLocation`](#errorLocation) property.
- `"top"` - Displays error messages above input fields.
- `"bottom"` - Displays error messages below input fields.

### `items`

**Type**: `MultipleTextItemModel[]`

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

### `itemTitleWidth`

**Type**: `string`

Specifies a uniform width for all text box titles. Accepts CSS values.

Default value: `""` (the width of each title depends on the title length)

## Methods

### `addItem()`

**Return value:** `MultipleTextItemModel`

Adds a new input item.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | An item name. |
| `title` | `string` | *(Optional)* An item title. |
