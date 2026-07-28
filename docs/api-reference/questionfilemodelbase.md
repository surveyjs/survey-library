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

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; `QuestionFileModelBase`

## Properties

### `storeDataAsText`

**Type**: `boolean`

Specifies whether to store file or signature content as text in `SurveyModel`'s [`data`](https://surveyjs.io/form-library/documentation/surveymodel#data) property.

If you disable this property, implement `SurveyModel`'s [`onUploadFiles`](https://surveyjs.io/form-library/documentation/surveymodel#onUploadFiles) event handler to specify how to store file content.

[File Upload Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

[Signature Pad Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))

### `waitForUpload`

**Type**: `boolean`

Enable this property if you want to wait until files are uploaded to complete the survey.

Default value: `false`

[File Upload Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

[Signature Pad Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))

## Events

### `onUploadStateChanged`

An event that is raised after the upload state has changed.

Parameters:

- `sender`: `SurveyModel`\
A survey instance that raised the event.
- `options.state`: `string`\
The current upload state: `"empty"`, `"loading"`, `"loaded"`, or `"error"`.
