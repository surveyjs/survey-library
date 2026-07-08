---
title: CalculatedValue
product: Form Library
api-type: class
description: The calculated value is a way to define the variable in Survey Creator.
source: https://surveyjs.io/form-library/documentation/api-reference/calculatedvalue
---

# `CalculatedValue`

The calculated value is a way to define the variable in Survey Creator.
It has two main properties: name and expression. Based on expression the value read-only property is automatically calculated.
The name property should be unique though all calculated values.
It uses survey.getVariable/seruvey.setVariable functions to get/set its value. The class do not store its value internally.
You may set includeIntoResult property to true to store this calculated value into survey result.

## Inheritance

`Base` &rarr; `CalculatedValue`

## Properties

### `expression`

The Expression that used to calculate the value. You may use standard operators like +, -, * and /, squares (). Here is the example of accessing the question value {questionname}.
Example: "({quantity} * {price}) * (100 - {discount}) / 100"

**Type**: `string`

### `includeIntoResult`

Set this property to true to include the non-empty calculated value into survey result, survey.data property.

**Type**: `boolean`

### `name`

The calculated value name. It should be non empty and unique.

**Type**: `string`
