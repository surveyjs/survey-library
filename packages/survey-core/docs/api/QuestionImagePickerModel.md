---
title: QuestionImagePickerModel
product: Form Library
api-type: class
description: "A class that describes the Image Picker question type. [View Demo](https://surveyjs.io/form-library/examples/image-picker-question/ (linkStyle))"
source: 
---

# `QuestionImagePickerModel`

A class that describes the Image Picker question type.

[View Demo](https://surveyjs.io/form-library/examples/image-picker-question/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase` &rarr; `QuestionImagePickerModel`

## Properties

### `hasSingleInput`

**Type**: `boolean`

### `isCompositeQuestion`

**Type**: `boolean`

### `multiSelect`

Specifies whether users can select multiple images or videos.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/image-picker-question/ (linkStyle))

**Type**: `boolean`

### `showLabel`

Specifies whether to display labels under images or videos. Labels text are taken from the `text` property of each object in the [`choices`](#choices) array.

[View Demo](https://surveyjs.io/form-library/examples/image-picker-question/ (linkStyle))

**Type**: `boolean`

### `imageHeight`

Specifies the height of containers for images or videos. Accepts positive numbers and CSS values.

Default value: `auto`

This property allows you to specify the exact image height. If you do not set it, the height will be calculated automatically based on the [`minImageHeight`](#minImageHeight) and [`maxImageHeight`](#maxImageHeight) values and available screen height.

Use the [`imageFit`](#imageFit) property to specify how to fit the images or videos into their containers.

**Type**: `number`

### `imageScale`

**Type**: `number`

### `responsiveImageHeight`

**Type**: `number`

### `renderedImageHeight`

**Type**: `number`

### `imageWidth`

Specifies the width of containers for images or videos. Accepts positive numbers and CSS values.

Default value: `auto`

This property allows you to specify the exact image width. If you do not set it, the width will be calculated automatically based on the [`minImageWidth`](#minImageWidth) and [`maxImageWidth`](#maxImageWidth) values and available screen width.

Use the [`imageFit`](#imageFit) property to specify how to fit the images or videos into their containers.

**Type**: `number`

### `responsiveImageWidth`

**Type**: `number`

### `renderedImageWidth`

**Type**: `number`

### `imageFit`

Specifies how to resize images or videos to fit them into their containers.

Refer to the [`object-fit`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) CSS property description for information on accepted values.

**Type**: `string`

### `contentMode`

Specifies the type of content that choice items display.

Possible values:

- `"image"` (default) - Images in one of the following formats: JPEG, GIF, PNG, APNG, SVG, BMP, ICO.
- `"video"` - Videos in one of the following formats: MP4, MOV, WMV, FLV, AVI, MKV.

**Type**: `string`

### `inputType`

**Type**: `"checkbox" | "radio"`

### `isResponsiveValue`

**Type**: `boolean`

### `maxImageWidth`

Specifies a maximum width for image or video containers. Accepts positive numbers and CSS values.

Default value: 3000

[View Demo](https://surveyjs.io/form-library/examples/how-to-create-calculator-form/ (linkStyle))

The `minImageWidth`, `maxImageWidth`, `minImageHeight`, and `maxImageHeight` properties specify boundary values for container sizes. The resulting sizes are selected depending on the available screen space. If you want to specify the exact width and height, use the [`imageWidth`](#imageWidth) and [`imageHeight`](#imageHeight) properties.

**Type**: `number`

### `minImageWidth`

Specifies a minimum width for image or video containers. Accepts positive numbers and CSS values.

Default value: 200

The `minImageWidth`, `maxImageWidth`, `minImageHeight`, and `maxImageHeight` properties specify boundary values for container sizes. The resulting sizes are selected depending on the available screen space. If you want to specify the exact width and height, use the [`imageWidth`](#imageWidth) and [`imageHeight`](#imageHeight) properties.

**Type**: `number`

### `maxImageHeight`

Specifies a maximum height for image or video containers. Accepts positive numbers and CSS values.

Default value: 3000

[View Demo](https://surveyjs.io/form-library/examples/how-to-create-calculator-form/ (linkStyle))

The `minImageWidth`, `maxImageWidth`, `minImageHeight`, and `maxImageHeight` properties specify boundary values for container sizes. The resulting sizes are selected depending on the available screen space. If you want to specify the exact width and height, use the [`imageWidth`](#imageWidth) and [`imageHeight`](#imageHeight) properties.

**Type**: `number`

### `minImageHeight`

Specifies a minimum height for image or video containers. Accepts positive numbers and CSS values.

Default value: 133

[View Demo](https://surveyjs.io/form-library/examples/how-to-create-calculator-form/ (linkStyle))

The `minImageWidth`, `maxImageWidth`, `minImageHeight`, and `maxImageHeight` properties specify boundary values for container sizes. The resulting sizes are selected depending on the available screen space. If you want to specify the exact width and height, use the [`imageWidth`](#imageWidth) and [`imageHeight`](#imageHeight) properties.

**Type**: `number`

### `_width`

**Type**: `number`

### `onContentLoaded`

**Type**: `(item: ImageItemValue, event: any) => void`

### `responsiveColCount`

**Type**: `number`

### `gridColCount`

**Type**: `number`

### `gapBetweenItems`

**Type**: `number`

### `reCalcGapBetweenItemsCallback`

**Type**: `() => void`

### `ariaRole`

**Type**: `string`

### `ariaRequired`

**Type**: `"true" | "false"`

### `inputRequiredAttribute`

**Type**: `boolean`

## Methods

### `getType()`

**Return value:** `string`

### `supportOther()`

**Return value:** `boolean`

### `supportNone()`

**Return value:** `boolean`

### `supportRefuse()`

**Return value:** `boolean`

### `supportDontKnow()`

**Return value:** `boolean`

### `isAnswerCorrect()`

**Return value:** `boolean`

### `isItemSelected()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getItemEnabled()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `clearIncorrectValues()`

### `isBuiltInChoice()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getSelectBaseRootCss()`

**Return value:** `string`

### `needResponsiveWidth()`

**Return value:** `boolean`

### `triggerResponsiveness()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `hard` | `boolean` |  |

### `afterRender()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |
