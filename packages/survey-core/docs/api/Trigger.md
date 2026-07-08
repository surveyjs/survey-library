---
title: Trigger
product: Form Library
api-type: class
description: "A base class for all triggers. A trigger calls a method when the expression change the result: from false to true or from true to false. Please note, it runs only one changing the expression result."
source: 
---

# `Trigger`

A base class for all triggers.
A trigger calls a method when the expression change the result: from false to true or from true to false.
Please note, it runs only one changing the expression result.

## Inheritance

`Base` &rarr; `Trigger`

## Properties

### `operatorsValue`

**Type**: `HashTable<Function>`

### `id`

**Type**: `number`

### `isGhost`

**Type**: `boolean`

### `operator`

**Type**: `string`

### `value`

**Type**: `any`

### `name`

**Type**: `string`

### `expression`

**Type**: `string`

### `requireValidQuestion`

**Type**: `boolean`

## Methods

### `getType()`

**Return value:** `string`

### `toString()`

**Return value:** `string`

### `checkExpression()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `{ isOnNextPage: boolean; isOnComplete: boolean; isOnNavigation: boolean; keys: any; properties?: HashTable<any>; }` |  |

### `check()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
