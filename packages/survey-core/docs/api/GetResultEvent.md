---
title: GetResultEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `GetResultEvent`

## Properties

### `response`

A server [response](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response).

**Type**: `any`

### `success`

A Boolean value that indicates whether survey results have been retrieved successfully.

**Type**: `boolean`

### `data`

An object with the following structure:

    ```js
    {
      AnswersCount: number, // A total number of posted answers to the question
      QuestionResult: object // All unique answers to the question and their number
    }
    ```

**Type**: `any`

### `dataList`

An array of objects with the following structure:

    ```js
    {
      name: string, // A unique answer to the question
      value: number // The number of user responses with this answer
    }
    ```

**Type**: `any[]`
