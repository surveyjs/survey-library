---
title: QuestionSignaturePadModel
product: Form Library
api-type: class
description: "A class that describes the Signature question type. [View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))"
source: 
---

# `QuestionSignaturePadModel`

A class that describes the Signature question type.

[View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionFileModelBase` &rarr; `QuestionSignaturePadModel`

## Properties

### `hasDrawnStroke`

**Type**: `boolean`

### `isReadyForUpload`

**Type**: `boolean`

### `canvas`

**Type**: `any`

### `element`

**Type**: `any`

### `scale`

**Type**: `number`

### `valueIsUpdatingInternally`

**Type**: `boolean`

### `valueWasChangedFromLastUpload`

**Type**: `boolean`

### `_loadedData`

**Type**: `string`

### `loadedData`

**Type**: `string`

### `updateValueHandler`

**Type**: `() => void`

### `dataFormat`

Specifies the format in which to store the signature image.

Possible values:

- `"png"` (default)
- `"jpeg"`
- `"svg"`

**Type**: `string`

### `signatureWidth`

Specifies the width of the signature area. Accepts positive integer numbers.

[View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))

**Type**: `number`

### `signatureHeight`

Specifies the height of the signature area. Accepts positive integer numbers.

**Type**: `number`

### `signatureAutoScaleEnabled`

Specifies whether the signature area should be scaled to fit into the question width.

Default value: `false`

This property auto-scales the signature area to fill all available width within the question box while maintaining the default 3:2 aspect ratio. If you set [custom width](#signatureWidth) and [height](#signatureHeight) values, the setting will keep the aspect ratio of these dimensions.

> The signature area is scaled only for display. The image saved in survey results will have dimensions specified by the [`signatureHeight`](#signatureHeight) and [`signatureWidth`](#signatureWidth) properties.

**Type**: `boolean`

### `penMinWidth`

Speicifies the minimum width of pen strokes, measured in pixels.

Default value: 0.5

**Type**: `number`

### `penMaxWidth`

Speicifies the maximum width of pen strokes, measured in pixels.

Default value: 2.5

**Type**: `number`

### `renderedCanvasWidth`

**Type**: `string`

### `height`

**Type**: `number`

### `allowClear`

Specifies whether to display a button that clears the signature area.

Default value: `true`

**Type**: `boolean`

### `canShowClearButton`

**Type**: `boolean`

### `penColor`

Specifies a color for the pen.

This property accepts color values in the following formats:

- Hexadecimal colors (`"#FF0000"`)
- RGB colors (`"rgb(255,0,0)"`)
- Color names (`"red"`)

[View Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))

**Type**: `string`

### `backgroundColor`

Specifies a color for the signature area background. Ignored if [`backgroundImage`](#backgroundImage) is set.

This property accepts color values in the following formats:

- Hexadecimal colors (`"#FF0000"`)
- RGB colors (`"rgb(255,0,0)"`)
- Color names (`"red"`)

**Type**: `string`

### `backgroundImage`

An image to display in the background of the signature area. Accepts a base64 or URL string value.

**Type**: `string`

### `showPlaceholder`

A Boolean value that specifies whether to show the placeholder text in the signature area.

Default value: `true`

Use the [`placeholder`](#placeholder) and [`placeholderReadOnly`](#placeholderReadOnly) properties to specify placeholder texts for the signature area in edit mode and in read-only or preview mode.

**Type**: `boolean`

### `locRenderedPlaceholder`

**Type**: `any`

### `placeholder`

A placeholder text for the signature area. Applies when the [`showPlaceholder`](#showPlaceholder) property is `true`.

**Type**: `string`

### `placeholderReadOnly`

A placeholder text for the signature area in read-only or preview mode. Applies when the [`showPlaceholder`](#showPlaceholder) property is `true`.

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

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

### `themeChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `theme` | `ITheme` |  |

### `onSurveyLoad()`

### `nothingIsDrawn()`

**Return value:** `boolean`

### `needShowPlaceholder()`

**Return value:** `boolean`
