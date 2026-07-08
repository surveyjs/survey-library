---
title: UploadFilesEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `UploadFilesEvent`

## Inheritance

`FileQuestionEventMixin` &rarr; `LoadFilesEvent` &rarr; `UploadFilesEvent`

## Properties

### `callback`

A callback function that you should call when a file is uploaded successfully or when file upload fails. Pass an array of successfully uploaded files as the first argument. As the second argument, you can pass an array of error messages if file upload failed.

**Type**: `(data: any, errors?: any) => any`

### `files`

An array of JavaScript <a href="https://developer.mozilla.org/en-US/docs/Web/API/File" target="_blank">File</a> objects that represent files to upload.

**Type**: `any[]`

### `sourceType`

Indicates the origin of the uploaded files.\
Possible values: `"file"`, `"camera"`, or `"signature"`.

**Type**: `string`
