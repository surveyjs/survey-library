---
title: IExpressionExecutor
product: Form Library
api-type: interface
description: Base interface for expression execution
source: https://surveyjs.io/form-library/documentation/api-reference/iexpressionexecutor
---

# `IExpressionExecutor`

Base interface for expression execution

## Properties

### `expression`

The expression as string, property with get

**Type**: `string`

### `isAsync`

Returns true if there is an async function in the expression

**Type**: `boolean`

### `onComplete`

This call back runs on executing expression if there is at least one async function

**Type**: `(res: any, id: number) => void`

## Methods

### `canRun()`

Returns true if the expression is valid and can be executed

**Return value:** `boolean`

### `getVariables()`

Returns the list of variables that used in the expression. They defined as: {variableName} in default parser.

**Return value:** `string[]<any>`

### `hasFunction()`

Returns true if there is a function in the expression

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `noParamsOnly` | `boolean` |  |

### `run()`

Run the expression. Returns the result of execution.
The result can be undefined if there is an asyn function. In this case result will be returned onComplete callback.

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `values` | `HashTable<any>` | has with values names and their results. Normally it is question names and their values |
| `properties` | `HashTable<any>` | the list of properties that are available in functions. Commonly it is survey and question, if expression execuited in a question context |
| `id` | `number` |  |
