---
title: CompleteBaseEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `CompleteBaseEvent`

## Properties

### `isCompleteOnTrigger`

Returns `true` if survey completion is caused by a ["complete" trigger](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#complete).

**Type**: `boolean`

### `completeTrigger`

A "complete" trigger that has been executed. This parameter has a value only if `options.isCompleteOnTrigger` is `true`.

**Type**: `Trigger`
