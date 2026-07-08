---
title: QuestionFileModelBase
product: Form Library
api-type: class
description: "A base class for question types that support file upload: `QuestionFileModel` and `QuestionSignaturePadModel`."
source: https://surveyjs.io/form-library/documentation/api-reference/questionfilemodelbase
---

# `QuestionFileModelBase`

A base class for question types that support file upload: `QuestionFileModel` and `QuestionSignaturePadModel`.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionFileModelBase`

## Properties

### `storeDataAsText`

Specifies whether to store file or signature content as text in `SurveyModel`'s [`data`](https://surveyjs.io/form-library/documentation/surveymodel#data) property.

If you disable this property, implement `SurveyModel`'s [`onUploadFiles`](https://surveyjs.io/form-library/documentation/surveymodel#onUploadFiles) event handler to specify how to store file content.

[File Upload Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

[Signature Pad Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))

**Type**: `boolean`

### `waitForUpload`

Enable this property if you want to wait until files are uploaded to complete the survey.

Default value: `false`

[File Upload Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

[Signature Pad Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))

**Type**: `boolean`

## Events

### `onUploadStateChanged`

An event that is raised after the upload state has changed.

Parameters:

- `sender`: `SurveyModel`\
A survey instance that raised the event.
- `options.state`: `string`\
The current upload state: `"empty"`, `"loading"`, `"loaded"`, or `"error"`.
