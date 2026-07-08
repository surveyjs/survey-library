---
title: ChoicesSearchEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `ChoicesSearchEvent`

## Inheritance

`QuestionEventMixin` &rarr; `ChoicesSearchEvent`

## Properties

### `filter`

A search string used to filter choice options.

**Type**: `string`

### `choices`

An array of all choice options.

**Type**: `ItemValue[]`

### `filteredChoices`

A filtered array of choice options. Apply `options.filter` to the `options.choices` array and assign the result to this parameter.

**Type**: `ItemValue[]`
