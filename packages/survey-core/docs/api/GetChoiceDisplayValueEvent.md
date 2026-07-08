---
title: GetChoiceDisplayValueEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `GetChoiceDisplayValueEvent`

## Inheritance

`QuestionEventMixin` &rarr; `GetChoiceDisplayValueEvent`

## Properties

### `setItems`

A method that you should call to assign display texts to the question.

**Type**: `(displayValues: string[], ...customValues: IValueItemCustomPropValues[]) => void`

### `values`

An array of one (in Dropdown) or more (in Tag Box) default values.

**Type**: `any[]`
