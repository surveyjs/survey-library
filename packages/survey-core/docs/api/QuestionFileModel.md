---
title: QuestionFileModel
product: Form Library
api-type: class
description: A class that describes the File Upload question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionfilemodel
---

# `QuestionFileModel`

A class that describes the File Upload question type.

[View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionFileModelBase` &rarr; `QuestionFileModel`

## Properties

### `acceptedCategories`

**Type**: `string[]`

An array of predefined file category names used to control which files users can upload.

Supported categories:

| Category name | File types |
| ------------- | ---------- |
| `"image"` | .png, .jpg, .jpeg, .gif, .bmp, .tiff, .svg |
| `"video"` | .mp4, .avi, .mov, .wmv, .flv, .mkv, .webm |
| `"audio"` | .mp3, .wav, .aac, .ogg, .wma, .flac |
| `"document"` | .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .rtf, .odt |
| `"archive"` | .zip, .rar, .7z, .tar, .gz |

To allow specific file extensions, use the [`acceptedTypes`](https://surveyjs.io/form-library/documentation/api-reference/file-model#acceptedTypes) property. This property can be used together with `acceptedCategories` to define a combined set of allowed files.

To add or remove file extensions within a category, modify the [`acceptedFileCategories`](https://surveyjs.io/form-library/documentation/api-reference/settings#acceptedFileCategories) object in the global settings.

### `acceptedTypes`

**Type**: `string`

An [`accept`](https://www.w3schools.com/tags/att_input_accept.asp) attribute value for the underlying `<input>` element.

[View Demo](https://surveyjs.io/form-library/examples/store-file-names-in-survey-results/ (linkStyle))

### `allowImagesPreview`

**Type**: `boolean`

Specifies whether to show a preview of image files.

### `allowMultiple`

**Type**: `boolean`

Specifies whether users can upload multiple files.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

### `fileOrPhotoPlaceholder`

**Type**: `string`

A placeholder text displayed when the File Upload question doesn't contain any files or photos to upload. Applies only when [`sourceType`](#sourceType) value is `"file-camera"`.

### `filePlaceholder`

**Type**: `string`

A placeholder text displayed when the File Upload question doesn't contain any files to upload. Applies only when the [`sourceType`](#sourceType) value is `"file"`.

### `imageHeight`

**Type**: `string`

The height of the following images:

- [Images in the preview](#allowImagesPreview)
- [Photos taken using the camera](#sourceType)
- Uploaded images in a [generated PDF form](https://surveyjs.io/pdf-generator/documentation/overview)

> The sizes of previewed images are limited by the height and width of the preview area in single file upload mode or that of a thumbnail area in [multiple file upload mode](#allowMultiple).

### `imageWidth`

**Type**: `string`

The width of the following images:

- [Images in the preview](#allowImagesPreview)
- [Photos taken using the camera](#sourceType)
- Uploaded images in a [generated PDF form](https://surveyjs.io/pdf-generator/documentation/overview)

> The sizes of previewed images are limited by the height and width of the preview area in single file upload mode or that of a thumbnail area in [multiple file upload mode](#allowMultiple).

### `maxFiles`

**Type**: `number`

Maximum number of files a user can upload. Applies only if [`allowMultiple`](https://surveyjs.io/form-library/documentation/api-reference/file-model#allowMultiple) is `true`.

Default value: 1000

### `maxSize`

**Type**: `number`

Maximum allowed file size, measured in bytes.

Default value: 0 (unlimited)

[View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

### `needConfirmRemoveFile`

**Type**: `boolean`

Specifies whether users should confirm file deletion.

Default value: `false`

### `photoPlaceholder`

**Type**: `string`

A placeholder text displayed when the File Upload question doesn't contain any photos to upload. Applies only when the [`sourceType`](#sourceType) value is `"camera"`.

### `showPreview`

**Type**: `boolean`

Disable this property only to implement a custom preview.

[View Demo](https://surveyjs.io/form-library/examples/file-custom-preview/ (linkStyle))

### `sourceType`

**Type**: `string`

Specifies the source of uploaded files.

Possible values:

- `"file"` (default) - Allows respondents to select a local file.
- `"camera"` - Allows respondents to capture and upload a photo.
- `"file-camera"` - Allows respondents to select a local file or capture a photo.

[View Demo](https://surveyjs.io/form-library/examples/photo-capture/ (linkStyle))

## Methods

### `loadFiles()`

Loads multiple files into the question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `files` | `any[]` | An array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects. |
| `sourceType` | `string` |  |

### `removeFile()`

Removes a file with a specified name.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
