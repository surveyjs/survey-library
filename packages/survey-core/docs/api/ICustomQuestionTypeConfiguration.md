---
title: ICustomQuestionTypeConfiguration
product: Form Library
api-type: interface
description: An interface used to create custom question types.
source: https://surveyjs.io/form-library/documentation/api-reference/icustomquestiontypeconfiguration
---

# `ICustomQuestionTypeConfiguration`

An interface used to create custom question types.

Refer to the following articles for more information:

- [Create Specialized Question Types](https://surveyjs.io/form-library/documentation/customize-question-types/create-specialized-question-types)
- [Create Composite Question Types](https://surveyjs.io/form-library/documentation/customize-question-types/create-composite-question-types)

## Properties

### `createElements`

**Type**: `any`

A function that allows you to create nested questions if you do not specify the `elementsJSON` property.

### `createQuestion`

**Type**: `any`

A function that allows you to create a custom question if you do not specify the `questionJSON` property.

### `defaultQuestionTitle`

**Type**: `any`

A default title for questions created with this question type. Survey authors can change the default title in the JSON object or in Survey Creator's Property Grid.

You can specify the question title with a string value or with an object that defines different titles for different locales:

```js
import { ComponentCollection } from "survey-core";

ComponentCollection.Instance.add({
  // ...
  defaultQuestionTitle: "Default title"
});
// ===== OR =====
ComponentCollection.Instance.add({
  // ...
  defaultQuestionTitle: {
    en: "Default title",
    de: "Standardtitel",
    fr: "Titre par défaut"
  }
});
```

### `elementsJSON`

**Type**: `any`

JSON schemas of nested questions. Specify this property to create a [composite question type](https://surveyjs.io/form-library/documentation/customize-question-types/create-composite-question-types).

### `getDisplayValue`

**Type**: `((keyAsText: boolean, value: any) => any) | ((question: Question) => any)`

A function that allows you to override the default `getDisplayValue()` implementation.

### `iconName`

**Type**: `string`

The name of an icon to use for the custom question type.

[UI Icons](https://surveyjs.io/form-library/documentation/icons (linkStyle))

### `inheritBaseProps`

**Type**: `boolean | string[]`

An array of property names to inherit from a base question or a Boolean value that specifies whether or not to inherit all properties.

Default value: `false`

When you create a [custom specialized question type](https://surveyjs.io/form-library/documentation/customize-question-types/create-specialized-question-types), you base it on another question type configured within the [`questionJSON`](#questionJSON) object. If the custom question type should inherit all properties from the base type, set the `inheritBaseProps` property to `true`. If you want to inherit only certain properties, set the `inheritBaseProps` property to an array of their names.

> If `inheritBaseProps` is set to `true`, properties declared in the `questionJSON` object are hidden in Survey Creator. To make them editable, include their names explicitly in the `inheritBaseProps` array.

[Create Specialized Question Types](https://surveyjs.io/form-library/documentation/customize-question-types/create-specialized-question-types (linkStyle))

### `name`

**Type**: `string`

A name used to identify a custom question type.

### `questionJSON`

**Type**: `any`

A JSON schema for a built-in question type on which the custom question type is based.

Refer to the [Create Specialized Question Types](https://surveyjs.io/form-library/documentation/customize-question-types/create-specialized-question-types) help topic for more information.

### `showInToolbox`

**Type**: `boolean`

Specifies whether the custom question type is available in the Toolbox and the Add Question menu in Survey Creator.

Default value: `true`

Set this property to `false` if your custom question type is used only to customize Property Grid content and is not meant for a survey.

### `title`

**Type**: `string`

A title used for this custom question type in the UI. When `title` is not specified, the `name` property value is used.

## Methods

### `getErrorText()`

**Return value:** `string` &ndash; An error text.

A function that allows you to display different error texts based on conditions.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` | A custom question. Use the `question.value` property to access the question's value. |

### `onAfterRender()`

A function that is called after the entire question is rendered.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A custom question.
- `htmlElement`: `any`\
An HTML element that represents the custom question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `htmlElement` | `any` |  |

### `onAfterRenderContentElement()`

A function that is called each time a question nested within a [composite question](https://surveyjs.io/form-library/documentation/customize-question-types/create-composite-question-types) is rendered.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A composite question.
- `element`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A nested question.
- `htmlElement`: `any`\
An HTML element that represents a nested question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `element` | `Question` |  |
| `htmlElement` | `any` |  |

### `onCreated()`

A function that is called when the custom question is created. Use it to access questions nested within a [composite question type](https://surveyjs.io/form-library/documentation/customize-question-types/create-composite-question-types).

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
The custom question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |

### `onInit()`

A function that is called when the custom question type is initialized. Use it to add, remove, or modify the type's properties (see [Override Base Question Properties](https://surveyjs.io/form-library/documentation/customize-question-types/create-composite-question-types#override-base-question-properties)).

### `onItemValuePropertyChanged()`

A function that is called when an [ItemValue](https://surveyjs.io/Documentation/Library?id=itemvalue) property is changed.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A custom question.
- `options.obj`: [ItemValue](https://surveyjs.io/Documentation/Library?id=itemvalue)\
An `ItemValue` object.
- `options.propertyName`: `string`\
The name of the property to which an array of `ItemValue` objects is assigned (for example, `"choices"` or `"rows"`).
- `options.name`: `string`\
The name of the changed property: `"text"` or `"value"`.
- `options.newValue`: `any`\
A new value for the property.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `options` | `{ obj: ItemValue; propertyName: string; name: string; newValue: any; }` |  |

### `onLoaded()`

A function that is called when JSON schemas are loaded.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A custom question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |

### `onPropertyChanged()`

A function that is called when a custom question type property is changed. Use it to handle property changes.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A custom question.
- `propertyName`: `string`\
The name of the changed property.
- `newValue`: `any`\
A new value for the property.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `propertyName` | `string` |  |
| `newValue` | `any` |  |

### `onUpdateQuestionCssClasses()`

A function that is called each time a question nested within a [composite question](https://surveyjs.io/form-library/documentation/customize-question-types/create-composite-question-types) requires an update of its CSS classes.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A composite question.
- `element`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A nested question.
- `cssClasses`: `any`\
An object with CSS classes applied to a nested question, for example, `{ root: "class1", button: "class2" }`. You can modify this object to apply custom CSS classes.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `element` | `Question` |  |
| `cssClasses` | `any` |  |

### `onValueChanged()`

A function that is called after the question value is changed in the UI.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A custom question.
- `name`: `string`\
The question's [name](https://surveyjs.io/Documentation/Library?id=Question#name).
- `newValue`: `any`\
A new value for the question.

If you want to perform some actions when the value is changed in code as well as in the UI, implement the [`onValueSet`](https://surveyjs.io/form-library/documentation/api-reference/icustomquestiontypeconfiguration#onValueSet) function.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `name` | `string` |  |
| `newValue` | `any` |  |

### `onValueChanging()`

**Return value:** `any`

A function that is called before a question value is changed in the UI.

This function should return the value you want to save: `newValue`, a custom value, or `undefined` if you want to clear the question value.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A custom question.
- `name`: `string`\
The question's [name](https://surveyjs.io/Documentation/Library?id=Question#name).
- `newValue`: `any`\
A new value for the question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `name` | `string` |  |
| `newValue` | `any` |  |

### `onValueSet()`

A function that is called after the question value is set.

Parameters:

- `question`: [Question](https://surveyjs.io/Documentation/Library?id=Question)\
A custom question.
- `newValue`: `any`\
A new value for the question.

Unlike the [`onValueChanged`](https://surveyjs.io/form-library/documentation/api-reference/icustomquestiontypeconfiguration#onValueChanged) function, which is called only when the question value is changed in the UI, `onValueSet` is called when the value is changed in code as well.

[View Demo](https://surveyjs.io/survey-creator/examples/smart-search-input/ (linkStyle))

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `Question` |  |
| `newValue` | `any` |  |
