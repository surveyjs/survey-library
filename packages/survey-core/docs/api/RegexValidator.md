---
title: RegexValidator
product: Form Library
api-type: class
description: "A class that implements validation using regular expressions. [View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))"
source: 
---

# `RegexValidator`

A class that implements validation using regular expressions.

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyValidator` &rarr; `RegexValidator`

## Properties

### `regex`

A regular expression used to validate values.

[View Demo](https://surveyjs.io/form-library/examples/javascript-form-validation/ (linkStyle))

**Type**: `string`

### `caseInsensitive`

Specifies whether uppercase and lowercase letters must be treated as distinct or equivalent when validating values.

Default value: `false` (uppercase and lowercase letters are treated as distinct)

**Type**: `boolean`

### `insensitive`

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
