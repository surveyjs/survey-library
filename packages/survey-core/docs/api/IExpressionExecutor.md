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

**Type**: `string`

The expression as string, property with get

### `isAsync`

**Type**: `boolean`

Returns true if there is an async function in the expression

### `onComplete`

**Type**: `(res: any, id: number) => void`

This call back runs on executing expression if there is at least one async function

## Methods

### `canRun()`

**Return value:** `boolean`

Returns true if the expression is valid and can be executed

### `getVariables()`

**Return value:** `string[]<any>`

Returns the list of variables that used in the expression. They defined as: {variableName} in default parser.

### `hasFunction()`

**Return value:** `boolean`

Returns true if there is a function in the expression

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `noParamsOnly` | `boolean` |  |

### `run()`

**Return value:** `any`

Run the expression. Returns the result of execution.
The result can be undefined if there is an asyn function. In this case result will be returned onComplete callback.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `values` | `HashTable<any>` | has with values names and their results. Normally it is question names and their values |
| `properties` | `HashTable<any>` | the list of properties that are available in functions. Commonly it is survey and question, if expression execuited in a question context |
| `id` | `number` |  |
