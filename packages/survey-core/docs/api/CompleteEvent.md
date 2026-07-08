---
title: CompleteEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `CompleteEvent`

## Inheritance

`CompleteBaseEvent` &rarr; `CompleteEvent`

## Properties

### `clearSaveMessages`

Call this method to hide the save operation messages.

**Type**: `(test?: string) => void`

### `showSaveSuccess`

Call this method to indicate that survey results are successfully saved. You can use the `text` parameter to display a custom message.

**Type**: `(text?: string) => void`

### `showSaveError`

Call this method to indicate that an error occurred during the save operation. You can use the `text` parameter to display a custom error message.

**Type**: `(text?: string) => void`

### `showSaveInProgress`

Call this method to indicate that the save operation is in progress. You can use the `text` parameter to display a custom message.

**Type**: `(text?: string) => void`

### `showDataSaving`

**Type**: `(text?: string) => void`

### `showDataSavingError`

**Type**: `(text?: string) => void`

### `showDataSavingSuccess`

**Type**: `(text?: string) => void`

### `showDataSavingClear`

**Type**: `(text?: string) => void`
