---
title: GetProgressTextEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `GetProgressTextEvent`

## Properties

### `questionCount`

The total number of questions with input fields. [Image](https://surveyjs.io/form-library/examples/add-image-and-video-to-survey/), [HTML](https://surveyjs.io/form-library/examples/questiontype-html/), and [Expression](https://surveyjs.io/form-library/examples/questiontype-expression/) questions are excluded.

**Type**: `number`

### `answeredQuestionCount`

The number of questions that have been answered.

**Type**: `number`

### `requiredQuestionCount`

The number of questions marked as required.

**Type**: `number`

### `requiredAnsweredQuestionCount`

The number of required questions that have been answered.

**Type**: `number`

### `text`

Progress text rendered in the [progress bar](#showProgressBar). You can change this parameter's value.

**Type**: `string`
