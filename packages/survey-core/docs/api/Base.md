---
title: Base
product: Form Library
api-type: class
description: A base class for all SurveyJS objects.
source: https://surveyjs.io/form-library/documentation/api-reference/base
---

# `Base`

A base class for all SurveyJS objects.

## Properties

### `inSurvey`

Returns `true` if the object is included in a survey.

This property may return `false`, for example, when you [create a survey model dynamically](https://surveyjs.io/form-library/documentation/design-survey-create-a-simple-survey#create-or-change-a-survey-model-dynamically).

**Type**: `boolean`

### `isDesignMode`

Returns `true` if the survey is being designed in Survey Creator.

**Type**: `boolean`

### `isLoadingFromJson`

Returns `true` if the object configuration is being loaded from JSON.

**Type**: `boolean`

### `isPage`

Returns `true` if the survey element is a page.

This property returns `false` for [`PageModel`](https://surveyjs.io/form-library/documentation/api-reference/page-model) objects in the following cases:

- `SurveyModel`'s [`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) is set to `"singlePage"`.
- The page is included in a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).

In those cases, the survey creates an internal `PageModel` object to show all questions on one page, and all regular pages become panels.

**Type**: `boolean`

### `isPanel`

Returns `true` if the survey element is a panel or acts as one.

This property returns `true` for `PageModel` objects in the following cases:

- `SurveyModel`'s [`questionsOnPageMode`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#questionsOnPageMode) is set to `"singlePage"`.
- The page is included in a [preview of given answers](https://surveyjs.io/form-library/documentation/design-survey/create-a-multi-page-survey#preview-page).

In those cases, the survey creates an internal `PageModel` object to show all questions on one page, and all regular pages become panels.

**Type**: `boolean`

### `isQuestion`

Returns `true` if the survey element is a question.

**Type**: `boolean`

### `isSurvey`

Returns `true` if the element is a survey.

**Type**: `boolean`

## Methods

### `clone()`

Creates a new object that has the same type and properties as the current SurveyJS object.

**Return value:** `Base`

### `fromJSON()`

Assigns a new JSON schema to the current survey element.

The JSON schema should contain only serializable properties of this survey element. Event handlers and properties that do not belong to the survey element are ignored.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `json` | `any` | A JSON schema that you want to apply to the current survey element. |
| `options` | `ILoadFromJSONOptions` | An object with configuration options. |
| `options.validatePropertyValues` | `boolean` | Pass `true` if you want to validate property values. Use the [`jsonErrors`](#jsonErrors) array to access validation errors. |

### `getLocalizationJSON()`

Returns a JSON schema that contains only locale strings and the minimal set of properties required to identify survey elements.

This method is syntactic sugar for calling the [`toJSON()`](#toJSON) method with the `storeLocaleStrings` option set to `"stringsOnly"`.

To apply a locale-strings-only schema to a survey model, call the [`mergeLocalizationJSON(json, locales)`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#mergeLocalizationJSON) method.

**Return value:** `any` &ndash; A locale-strings-only JSON schema.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `locales` | `string[]` | *(Optional)* An array of locale identifiers to include in the JSON schema. |

### `getOwner()`

Returns the survey element that owns this element. Returns `undefined` if called on a `SurveyModel` instance.

**Return value:** `any` &ndash; The owner survey element, or `undefined` if none exists.

### `getPropertyByName()`

Returns a `JsonObjectProperty` object with metadata about a serializable property that belongs to the current SurveyJS object.

If the property is not found, this method returns `null`.

**Return value:** `JsonObjectProperty`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `propName` | `string` | A property name. |

### `getPropertyValue()`

Returns the value of a property with a specified name.

If the property is not found or does not have a value, this method returns either `undefined`, `defaultValue` specified in the property configuration, or a value passed as the `defaultValue` parameter.

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A property name. |
| `defaultValue` | `any` | *(Optional)* A value to return if the property is not found or does not have a value. |
| `calcFunc` | `() => any` |  |

### `getType()`

Returns the object type as it is used in the JSON schema.

**Return value:** `string`

### `isDescendantOf()`

Use this method to find out if the current object is of a given `typeName` or inherited from it.

**Return value:** `boolean` &ndash; `true` if the current object is of a given `typeName` or inherited from it.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `typeName` | `string` | One of the values listed in the [getType()](https://surveyjs.io/form-library/documentation/question#getType) description. |

### `isValueEmpty()`

Returns `true` if a passed `value` is an empty string, array, or object or if it equals to `undefined` or `null`.

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` | A value to be checked. |
| `trimString` | `boolean` | *(Optional)* When this parameter is `true`, the method ignores whitespace characters at the beginning and end of a string value. Pass `false` to disable this functionality. |

### `registerPropertyChangedHandlers()`

Registers a single value change handler for one or multiple properties.

The `registerPropertyChangedHandlers` and [`unregisterPropertyChangedHandlers`](#unregisterPropertyChangedHandlers) methods allow you to manage property change event handlers dynamically. If you only need to attach an event handler without removing it afterwards, you can use the [`onPropertyChanged`](#onPropertyChanged) event instead.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `propertyNames` | `string[]` | An array of one or multiple property names. |
| `handler` | `any` | A function to call when one of the listed properties change. Accepts a new property value as an argument. |
| `key` | `string` | *(Optional)* A key that identifies the current registration. If a function for one of the properties is already registered with the same key, the function will be overwritten. You can also use the key to subsequently unregister handlers. |

### `setPropertyValue()`

Assigns a new value to a specified property.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` | A property name. |
| `val` | `any` | A new value for the property. |

### `toJSON()`

Returns a JSON schema that corresponds to the current survey element.

**Return value:** `any` &ndash; A JSON schema of the survey element.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `ISaveToJSONOptions` | An [`ISaveToJSONOptions`](https://surveyjs.io/form-library/documentation/api-reference/isavetojsonoptions) object with configuration options. |

### `unregisterPropertyChangedHandlers()`

Unregisters value change event handlers for the specified properties.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `propertyNames` | `string[]` | An array of one or multiple property names. |
| `key` | `string` | *(Optional)* A key of the registration that you want to cancel. |

### `validateExpressions()`

Validates expressions used in the survey.

This method detects the following types of errors:

- Unknown variable\
The expression references an undefined variable or an unknown question, panel, or page name.

- Unknown function\
The expression references an unregistered function.

- Semantic error\
The expression is syntactically valid but has no meaningful effect because it always evaluates to the same value.

- Syntax error\
The expression contains invalid syntax, such as unmatched parentheses, missing operands, or invalid operators.

You can disable checks for unknown variables, unknown functions, and semantic errors by passing an `options` object with the `variables`, `functions`, or `semantics` property set to `false`. Syntax errors are always validated.

```js
// ...
// Omitted: `SurveyModel` creation
// ...

// Validate syntax errors only
const res = survey.validateExpressions({
  variables: false,
  functions: false,
  semantics: false
});
```

**Return value:** `IExpressionValidationResult[]<IExpressionValidationResult>` &ndash; An [`IExpressionValidationResult`](https://surveyjs.io/form-library/documentation/api-reference/IExpressionValidationResult) array.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `IExpressionValidationOptions` | Configuration options that control which validation checks are performed. |
| `options.variables` | `boolean` | Pass `false` to disable validation of unknown variables. |
| `options.functions` | `boolean` | Pass `false` to disable validation of unknown functions. |
| `options.semantics` | `boolean` | Pass `false` to disable validation of semantic errors. |

## Events

### `onItemValuePropertyChanged`

An event that is raised when an [`ItemValue`](https://surveyjs.io/form-library/documentation/itemvalue) property is changed.

Parameters:

- `sender`: `this`\
A SurveyJS object whose property contains an array of `ItemValue` objects.
- `options.obj`: [`ItemValue`](https://surveyjs.io/form-library/documentation/itemvalue)\
An `ItemValue` object.
- `options.propertyName`: `string`\
The name of the property to which an array of `ItemValue` objects is assigned (for example, `"choices"` or `"rows"`).
- `options.name`: `"text"` | `"value"`\
The name of the changed property.
- `options.newValue`: `any`\
A new value for the property.

### `onPropertyChanged`

An event that is raised when a property of this SurveyJS object has changed.

Parameters:

- `sender`: `this`\
A SurveyJS object whose property has changed.
- `options.name`: `string`\
The name of the changed property.
- `options.newValue`: `any`\
A new value for the property.
- `options.oldValue`: `any`\
An old value of the property. If the property is an array, `oldValue` contains the same array as `newValue` does.

If you need to add and remove property change event handlers dynamically, use the [`registerPropertyChangedHandlers`](#registerPropertyChangedHandlers) and [`unregisterPropertyChangedHandlers`](#unregisterPropertyChangedHandlers) methods instead.
