---
title: ClearFilesEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `ClearFilesEvent`

## Inheritance

`FileQuestionEventMixin` &rarr; `LoadFilesEvent` &rarr; `ClearFilesEvent`

## Properties

### `callback`

A callback function that you should call when files are deleted successfully or when deletion fails. Pass `"success"` or `"error"` as the first argument to indicate the operation status. As the second argument, you can pass deleted files' data (`options.value`) if file deletion was successful or an error message if file deletion failed.

**Type**: `(status: string, data?: any) => any`

### `fileName`

The name of a file to delete. When this parameter is `null`, all files should be deleted.

**Type**: `string`

### `value`

The File Upload question's [`value`](https://surveyjs.io/form-library/documentation/api-reference/file-model#value) that contains metadata about uploaded files.

**Type**: `any`
