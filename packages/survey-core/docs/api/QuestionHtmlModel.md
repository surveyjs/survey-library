---
title: QuestionHtmlModel
product: Form Library
api-type: class
description: "A class that describes the HTML question type. Unlike other question types, HTML cannot have a title or value. [View Demo](https://surveyjs.io/form-library/examples/questiontype-html/ (linkStyle))"
source: 
---

# `QuestionHtmlModel`

A class that describes the HTML question type. Unlike other question types, HTML cannot have a title or value.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-html/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionNonValue` &rarr; `QuestionHtmlModel`

## Properties

### `ignoreHtmlProgressing`

**Type**: `boolean`

### `isCompositeQuestion`

**Type**: `boolean`

### `html`

HTML markup to display.

[View Demo](https://surveyjs.io/form-library/examples/add-html-form-field/ (linkStyle))

> If you get the markup from a third party, ensure that it does not contain malicious code.

**Type**: `string`

### `processedHtml`

**Type**: `string`

### `isNewA11yStructure`

**Type**: `boolean`

### `renderCssRoot`

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `getProcessedText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |
