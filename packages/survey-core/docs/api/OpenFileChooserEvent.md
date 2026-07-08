---
title: OpenFileChooserEvent
product: Form Library
api-type: interface
description: 
source: 
---

# `OpenFileChooserEvent`

## Properties

### `input`

A file input HTML element.

**Type**: `any`

### `element`

A question for which this event is raised.

**Type**: `Base`

### `elementType`

The type of the element passed as the `options.element` parameter.\
Possible values: any value returned from the [`getType()`](https://surveyjs.io/form-library/documentation/api-reference/question#getType) method.

**Type**: `string`

### `propertyName`

The name of the survey element property for which files are being selected.

**Type**: `string`

### `item`

A choice item for which the event is raised. This parameter has a value only when the dialog window is opened to select images for an [Image Picker](https://surveyjs.io/form-library/documentation/api-reference/image-picker-question-model) question.

**Type**: `ItemValue`

### `callback`

A callback function to which you should pass selected files.

**Type**: `(files: any[]) => void`
