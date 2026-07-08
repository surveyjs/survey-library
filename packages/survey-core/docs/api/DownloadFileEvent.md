---
title: DownloadFileEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `DownloadFileEvent`

## Inheritance

`FileQuestionEventMixin` &rarr; `LoadFilesEvent` &rarr; `DownloadFileEvent`

## Properties

### `callback`

A callback function that you should call when a file is downloaded successfully or when deletion fails. Pass `"success"` or `"error"` as the first argument to indicate the operation status. As the second argument, you can pass the downloaded file's data as a Base64 string if file download was successful or an error message if file download failed.

**Type**: `(status: string, data?: any) => any`

### `fileValue`

The File Upload question's [`value`](https://surveyjs.io/form-library/documentation/api-reference/file-model#value) that contains metadata about uploaded files.

**Type**: `any`

### `content`

A file identifier (URL, file name, etc.) stored in survey results.

**Type**: `any`
