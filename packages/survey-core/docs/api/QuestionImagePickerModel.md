---
title: QuestionImagePickerModel
product: Form Library
api-type: class
description: A class that describes the Image Picker question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionimagepickermodel
---

# `QuestionImagePickerModel`

A class that describes the Image Picker question type.

[View Demo](https://surveyjs.io/form-library/examples/image-picker-question/ (linkStyle))

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; [`QuestionSelectBase`](https://surveyjs.io/form-library/documentation/api-reference/questionselectbase.md) &rarr; [`QuestionCheckboxBase`](https://surveyjs.io/form-library/documentation/api-reference/questioncheckboxbase.md) &rarr; `QuestionImagePickerModel`

## Properties

### `contentMode`

**Type**: `string`

Specifies the type of content that choice items display.

Possible values:

- `"image"` (default) - Images in one of the following formats: JPEG, GIF, PNG, APNG, SVG, BMP, ICO.
- `"video"` - Videos in one of the following formats: MP4, MOV, WMV, FLV, AVI, MKV.

### `imageFit`

**Type**: `string`

Specifies how to resize images or videos to fit them into their containers.

Refer to the [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property description for information on accepted values.

**Related APIs:** [`imageHeight`](#imageHeight), [`imageWidth`](#imageWidth)

### `imageHeight`

**Type**: `number`

Specifies the height of containers for images or videos. Accepts positive numbers and CSS values.

Default value: `auto`

This property allows you to specify the exact image height. If you do not set it, the height will be calculated automatically based on the [`minImageHeight`](#minImageHeight) and [`maxImageHeight`](#maxImageHeight) values and available screen height.

Use the [`imageFit`](#imageFit) property to specify how to fit the images or videos into their containers.

**Related APIs:** [`imageWidth`](#imageWidth)

### `imageWidth`

**Type**: `number`

Specifies the width of containers for images or videos. Accepts positive numbers and CSS values.

Default value: `auto`

This property allows you to specify the exact image width. If you do not set it, the width will be calculated automatically based on the [`minImageWidth`](#minImageWidth) and [`maxImageWidth`](#maxImageWidth) values and available screen width.

Use the [`imageFit`](#imageFit) property to specify how to fit the images or videos into their containers.

**Related APIs:** [`imageHeight`](#imageHeight)

### `maxImageHeight`

**Type**: `number`

Specifies a maximum height for image or video containers. Accepts positive numbers and CSS values.

Default value: 3000

[View Demo](https://surveyjs.io/form-library/examples/how-to-create-calculator-form/ (linkStyle))

The `minImageWidth`, `maxImageWidth`, `minImageHeight`, and `maxImageHeight` properties specify boundary values for container sizes. The resulting sizes are selected depending on the available screen space. If you want to specify the exact width and height, use the [`imageWidth`](#imageWidth) and [`imageHeight`](#imageHeight) properties.

### `maxImageWidth`

**Type**: `number`

Specifies a maximum width for image or video containers. Accepts positive numbers and CSS values.

Default value: 3000

[View Demo](https://surveyjs.io/form-library/examples/how-to-create-calculator-form/ (linkStyle))

The `minImageWidth`, `maxImageWidth`, `minImageHeight`, and `maxImageHeight` properties specify boundary values for container sizes. The resulting sizes are selected depending on the available screen space. If you want to specify the exact width and height, use the [`imageWidth`](#imageWidth) and [`imageHeight`](#imageHeight) properties.

### `minImageHeight`

**Type**: `number`

Specifies a minimum height for image or video containers. Accepts positive numbers and CSS values.

Default value: 133

[View Demo](https://surveyjs.io/form-library/examples/how-to-create-calculator-form/ (linkStyle))

The `minImageWidth`, `maxImageWidth`, `minImageHeight`, and `maxImageHeight` properties specify boundary values for container sizes. The resulting sizes are selected depending on the available screen space. If you want to specify the exact width and height, use the [`imageWidth`](#imageWidth) and [`imageHeight`](#imageHeight) properties.

### `minImageWidth`

**Type**: `number`

Specifies a minimum width for image or video containers. Accepts positive numbers and CSS values.

Default value: 200

The `minImageWidth`, `maxImageWidth`, `minImageHeight`, and `maxImageHeight` properties specify boundary values for container sizes. The resulting sizes are selected depending on the available screen space. If you want to specify the exact width and height, use the [`imageWidth`](#imageWidth) and [`imageHeight`](#imageHeight) properties.

### `multiSelect`

**Type**: `boolean`

Specifies whether users can select multiple images or videos.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/image-picker-question/ (linkStyle))

### `showLabel`

**Type**: `boolean`

Specifies whether to display labels under images or videos. Labels text are taken from the `text` property of each object in the [`choices`](#choices) array.

[View Demo](https://surveyjs.io/form-library/examples/image-picker-question/ (linkStyle))
