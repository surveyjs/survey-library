---
title: QuestionSignaturePadModel
product: Form Library
api-type: class
description: A class that describes the Signature question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionsignaturepadmodel
---

# `QuestionSignaturePadModel`

A class that describes the Signature question type.

[View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionFileModelBase`](https://surveyjs.io/form-library/documentation/api-reference/questionfilemodelbase.md) &rarr; `QuestionSignaturePadModel`

## Properties

### `allowClear`

**Type**: `boolean`

Specifies whether to display a button that clears the signature area.

Default value: `true`

### `backgroundColor`

**Type**: `string`

Specifies a color for the signature area background. Ignored if [`backgroundImage`](#backgroundImage) is set.

This property accepts color values in the following formats:

- Hexadecimal colors (`"#FF0000"`)
- RGB colors (`"rgb(255,0,0)"`)
- Color names (`"red"`)

**Related APIs:** [`penColor`](#penColor)

### `backgroundImage`

**Type**: `string`

An image to display in the background of the signature area. Accepts a base64 or URL string value.

**Related APIs:** [`backgroundColor`](#backgroundColor)

### `dataFormat`

**Type**: `string`

Specifies the format in which to store the signature image.

Possible values:

- `"png"` (default)
- `"jpeg"`
- `"svg"`

### `penColor`

**Type**: `string`

Specifies a color for the pen.

This property accepts color values in the following formats:

- Hexadecimal colors (`"#FF0000"`)
- RGB colors (`"rgb(255,0,0)"`)
- Color names (`"red"`)

[View Demo](https://surveyjs.io/form-library/examples/upload-signature-pad-data-to-server/ (linkStyle))

**Related APIs:** [`backgroundColor`](#backgroundColor)

### `penMaxWidth`

**Type**: `number`

Speicifies the maximum width of pen strokes, measured in pixels.

Default value: 2.5

### `penMinWidth`

**Type**: `number`

Speicifies the minimum width of pen strokes, measured in pixels.

Default value: 0.5

### `placeholder`

**Type**: `string`

A placeholder text for the signature area. Applies when the [`showPlaceholder`](#showPlaceholder) property is `true`.

### `placeholderReadOnly`

**Type**: `string`

A placeholder text for the signature area in read-only or preview mode. Applies when the [`showPlaceholder`](#showPlaceholder) property is `true`.

### `showPlaceholder`

**Type**: `boolean`

A Boolean value that specifies whether to show the placeholder text in the signature area.

Default value: `true`

Use the [`placeholder`](#placeholder) and [`placeholderReadOnly`](#placeholderReadOnly) properties to specify placeholder texts for the signature area in edit mode and in read-only or preview mode.

### `signatureAutoScaleEnabled`

**Type**: `boolean`

Specifies whether the signature area should be scaled to fit into the question width.

Default value: `false`

This property auto-scales the signature area to fill all available width within the question box while maintaining the default 3:2 aspect ratio. If you set [custom width](#signatureWidth) and [height](#signatureHeight) values, the setting will keep the aspect ratio of these dimensions.

> The signature area is scaled only for display. The image saved in survey results will have dimensions specified by the [`signatureHeight`](#signatureHeight) and [`signatureWidth`](#signatureWidth) properties.

### `signatureHeight`

**Type**: `number`

Specifies the height of the signature area. Accepts positive integer numbers.

### `signatureWidth`

**Type**: `number`

Specifies the width of the signature area. Accepts positive integer numbers.

[View Demo](https://surveyjs.io/form-library/examples/signature-pad-widget-javascript/ (linkStyle))
