---
title: TextValidator
product: Form Library
api-type: class
description: "A class that implements a validator for text values. [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))"
source: 
---

# `TextValidator`

A class that implements a validator for text values.

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyValidator` &rarr; `TextValidator`

## Properties

### `minLength`

The minimum length of a text value measured in characters.

Default value: 0

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

**Type**: `number`

### `maxLength`

The maximum length of a text value measured in characters.

Default value: 0 (unlimited)

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

**Type**: `number`

### `allowDigits`

Specifies whether a text value can include numerical digits.

Default value: `true`

**Type**: `boolean`

## Methods

### `getType()`

**Return value:** `string`

### `validate()`

**Return value:** `ValidatorResult`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
| `name` | `string` |  |
| `properties` | `any` |  |
