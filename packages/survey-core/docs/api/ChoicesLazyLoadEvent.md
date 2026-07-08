---
title: ChoicesLazyLoadEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `ChoicesLazyLoadEvent`

## Inheritance

`QuestionEventMixin` &rarr; `ChoicesLazyLoadEvent`

## Properties

### `setItems`

A method that you should call to assign loaded items to the question. Item objects should be structured as specified in the [`choices`](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model#choices) property description. If their structure is different, [map their properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to bring them to the required structure.

**Type**: `(items: (string | { value: any; text?: string; imageLink?: string; customProperty?: any; })[], totalCount: number) => void`

### `filter`

A search string used to filter choices.

**Type**: `string`

### `take`

The number of choice items to load. You can use the question's [`choicesLazyLoadPageSize`](https://surveyjs.io/form-library/documentation/questiondropdownmodel#choicesLazyLoadPageSize) property to change this number.

**Type**: `number`

### `skip`

The number of choice items to skip.

**Type**: `number`
