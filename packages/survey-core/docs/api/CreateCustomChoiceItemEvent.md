---
title: CreateCustomChoiceItemEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `CreateCustomChoiceItemEvent`

## Properties

### `question`

A question for which the event is raised.

**Type**: `QuestionSelectBase`

### `item`

A custom choice item. To access its value and display text, use the `options.item.value` and `options.item.text` properties.

**Type**: `ItemValue`

### `allow`

A Boolean property that you can set to `false` if you want to prevent the item from being added.

**Type**: `boolean`
