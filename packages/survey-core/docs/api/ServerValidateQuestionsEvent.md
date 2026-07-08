---
title: ServerValidateQuestionsEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `ServerValidateQuestionsEvent`

## Properties

### `complete`

A method that you should call when a request to the server has completed.

**Type**: `() => void`

### `errors`

An object for your error messages. Set error messages as follows: `options.errors["questionName"] = "My error message"`.

**Type**: `{ [index: string]: any; }`

### `data`

Question values. You can get an individual question value as follows: `options.data["questionName"]`.

**Type**: `{ [index: string]: any; }`
