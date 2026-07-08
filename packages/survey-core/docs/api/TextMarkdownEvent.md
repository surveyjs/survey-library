---
title: TextMarkdownEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `TextMarkdownEvent`

## Inheritance

`TextProcessingEvent` &rarr; `TextMarkdownEvent`

## Properties

### `item`

A choice item for which the event is raised. This parameter has a value only when `options.element` is a choice-based question, such as [Dropdown](https://surveyjs.io/form-library/documentation/api-reference/dropdown-menu-model) or [Checkboxes](https://surveyjs.io/form-library/documentation/api-reference/checkbox-question-model).

**Type**: `ItemValue`

### `text`

A string with Markdown content. Convert this content to HTML and assign the result to the `options.html` parameter.

**Type**: `string`

### `html`

A property to which you should assign HTML content.

**Type**: `string`
