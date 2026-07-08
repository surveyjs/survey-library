---
title: ExpressionRunningEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `ExpressionRunningEvent`

## Properties

### `element`

A survey element (question, panel, page, choice option, matrix row, column, trigger, validator, survey, etc.) for which the event is raised.

**Type**: `Base`

### `propertyName`

The name of the survey element property that contains the expression (for example, `visibleIf`).

**Type**: `string`

### `expression`

The expression being evaluated.\
You can modify this value to substitute a different expression for evaluation. The original expression property remains unchanged.

**Type**: `string`

### `allow`

A Boolean property that you can set to `false` if you want to cancel the expression eveluation.

**Type**: `boolean`
