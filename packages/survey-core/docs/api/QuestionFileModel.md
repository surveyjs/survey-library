---
title: QuestionFileModel
product: Form Library
api-type: class
description: "A class that describes the File Upload question type. [View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))"
source: 
---

# `QuestionFileModel`

A class that describes the File Upload question type.

[View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionFileModelBase` &rarr; `QuestionFileModel`

## Properties

### `isDragging`

**Type**: `boolean`

### `previewValue`

**Type**: `any[]`

### `pages`

**Type**: `QuestionFilePage[]`

### `navigationDirection`

**Type**: `"left" | "right" | "left-delete"`

### `indexToShow`

**Type**: `number`

### `pageSize`

**Type**: `number`

### `containsMultiplyFiles`

**Type**: `boolean`

### `allowCameraAccess`

**Type**: `boolean`

### `sourceType`

Specifies the source of uploaded files.

Possible values:

- `"file"` (default) - Allows respondents to select a local file.
- `"camera"` - Allows respondents to capture and upload a photo.
- `"file-camera"` - Allows respondents to select a local file or capture a photo.

[View Demo](https://surveyjs.io/form-library/examples/photo-capture/ (linkStyle))

**Type**: `string`

### `actionsContainerValue`

**Type**: `ActionContainer<Action>`

### `actionsContainer`

**Type**: `ActionContainer<Action>`

### `fileNavigatorValue`

**Type**: `ActionContainer<Action>`

### `fileNavigator`

**Type**: `ActionContainer<Action>`

### `closeCameraActionValue`

**Type**: `Action`

### `closeCameraAction`

**Type**: `Action`

### `takePictureActionValue`

**Type**: `Action`

### `takePictureAction`

**Type**: `Action`

### `changeCameraActionValue`

**Type**: `Action`

### `changeCameraAction`

**Type**: `Action`

### `videoId`

**Type**: `string`

### `hasVideoUI`

**Type**: `boolean`

### `hasFileUI`

**Type**: `boolean`

### `videoStream`

**Type**: `any`

### `canFlipCameraValue`

**Type**: `boolean`

### `prevPreviewLength`

**Type**: `number`

### `showPreview`

Disable this property only to implement a custom preview.

[View Demo](https://surveyjs.io/form-library/examples/file-custom-preview/ (linkStyle))

**Type**: `boolean`

### `allowMultiple`

Specifies whether users can upload multiple files.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

**Type**: `boolean`

### `imageHeight`

The height of the following images:

- [Images in the preview](#allowImagesPreview)
- [Photos taken using the camera](#sourceType)
- Uploaded images in a [generated PDF form](https://surveyjs.io/pdf-generator/documentation/overview)

> The sizes of previewed images are limited by the height and width of the preview area in single file upload mode or that of a thumbnail area in [multiple file upload mode](#allowMultiple).

**Type**: `string`

### `imageWidth`

The width of the following images:

- [Images in the preview](#allowImagesPreview)
- [Photos taken using the camera](#sourceType)
- Uploaded images in a [generated PDF form](https://surveyjs.io/pdf-generator/documentation/overview)

> The sizes of previewed images are limited by the height and width of the preview area in single file upload mode or that of a thumbnail area in [multiple file upload mode](#allowMultiple).

**Type**: `string`

### `acceptedCategories`

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

**Type**: `string[]`

### `acceptedTypes`

An [`accept`](https://www.w3schools.com/tags/att_input_accept.asp) attribute value for the underlying `<input>` element.

[View Demo](https://surveyjs.io/form-library/examples/store-file-names-in-survey-results/ (linkStyle))

**Type**: `string`

### `renderedAcceptedTypes`

**Type**: `string`

### `allowImagesPreview`

Specifies whether to show a preview of image files.

**Type**: `boolean`

### `maxSize`

Maximum allowed file size, measured in bytes.

Default value: 0 (unlimited)

[View Demo](https://surveyjs.io/form-library/examples/file-upload/ (linkStyle))

**Type**: `number`

### `maxFiles`

Maximum number of files a user can upload. Applies only if [`allowMultiple`](https://surveyjs.io/form-library/documentation/api-reference/file-model#allowMultiple) is `true`.

Default value: 1000

**Type**: `number`

### `needConfirmRemoveFile`

Specifies whether users should confirm file deletion.

Default value: `false`

**Type**: `boolean`

### `confirmRemoveMessage`

**Type**: `string`

### `confirmRemoveAllMessage`

**Type**: `string`

### `noFileChosenCaption`

**Type**: `string`

### `chooseButtonCaption`

**Type**: `string`

### `takePhotoCaption`

**Type**: `string`

### `replaceButtonCaption`

**Type**: `string`

### `removeFileCaption`

**Type**: `string`

### `loadingFileTitle`

**Type**: `string`

### `chooseFileTitle`

**Type**: `string`

### `clearButtonCaption`

**Type**: `string`

### `fileOrPhotoPlaceholder`

A placeholder text displayed when the File Upload question doesn't contain any files or photos to upload. Applies only when [`sourceType`](#sourceType) value is `"file-camera"`.

**Type**: `string`

### `photoPlaceholder`

A placeholder text displayed when the File Upload question doesn't contain any photos to upload. Applies only when the [`sourceType`](#sourceType) value is `"camera"`.

**Type**: `string`

### `filePlaceholder`

A placeholder text displayed when the File Upload question doesn't contain any files to upload. Applies only when the [`sourceType`](#sourceType) value is `"file"`.

**Type**: `string`

### `locRenderedPlaceholderValue`

**Type**: `LocalizableString`

### `locRenderedPlaceholder`

**Type**: `LocalizableString`

### `currentMode`

**Type**: `string`

### `isPlayingVideo`

**Type**: `boolean`

### `chooseButtonText`

**Type**: `string`

### `isClearingFiles`

**Type**: `boolean`

### `renderCapture`

**Type**: `string`

### `showFileDecorator`

**Type**: `boolean`

### `showDragAreaPlaceholder`

**Type**: `boolean`

### `showLoadingIndicator`

**Type**: `boolean`

### `allowShowPreview`

**Type**: `boolean`

### `showPreviewContainer`

**Type**: `boolean`

### `cameraValue`

**Type**: `Camera`

### `prevLoadedPreviewValue`

**Type**: `any`

### `fileRootCss`

**Type**: `string`

### `_renderedPages`

**Type**: `QuestionFilePage[]`

### `renderedPages`

**Type**: `QuestionFilePage[]`

### `pagesAnimation`

**Type**: `AnimationTab<QuestionFilePage>`

### `calcAvailableItemsCount`

**Type**: `(availableWidth: number, itemWidth: number, gap: number) => number`

### `calculatedGapBetweenItems`

**Type**: `number`

### `calculatedItemWidth`

**Type**: `number`

### `_width`

**Type**: `number`

### `rootElement`

**Type**: `any`

### `dragCounter`

**Type**: `number`

### `onDragEnter`

**Type**: `(event: any) => void`

### `onDragOver`

**Type**: `(event: any) => boolean`

### `onDrop`

**Type**: `(event: any) => void`

### `onDragLeave`

**Type**: `(event: any) => void`

### `doChange`

**Type**: `(event: any) => void`

### `doClean`

**Type**: `() => void`

### `doDownloadFileFromContainer`

**Type**: `(event: any) => void`

### `doDownloadFile`

**Type**: `(event: any, data: any) => void`

## Methods

### `startVideo()`

### `stopVideo()`

### `snapPicture()`

### `canFlipCamera()`

**Return value:** `boolean`

### `flipCamera()`

### `onHidingContent()`

### `getType()`

**Return value:** `string`

### `chooseFile()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `event` | `any` |  |

### `getConfirmRemoveMessage()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fileName` | `string` |  |

### `clear()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `doneCallback` | `() => void` |  |

### `removeFile()`

Removes a file with a specified name.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `loadFiles()`

Loads multiple files into the question.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `files` | `any[]` | An array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects. |
| `sourceType` | `string` |  |

### `canPreviewImage()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `fileItem` | `any` |  |

### `getPlainData()`

**Return value:** `IQuestionPlainData`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `IPlainDataOptions` |  |

### `getImageWrapperCss()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `data` | `any` |  |

### `getRemoveButtonCss()`

**Return value:** `string`

### `getChooseFileCss()`

**Return value:** `string`

### `getReadOnlyFileCss()`

**Return value:** `string`

### `getFileDecoratorCss()`

**Return value:** `string`

### `onSurveyLoad()`

### `triggerResponsiveness()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `hard` | `boolean` |  |

### `afterRenderQuestionElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |

### `beforeDestroyQuestionElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |

### `dispose()`
