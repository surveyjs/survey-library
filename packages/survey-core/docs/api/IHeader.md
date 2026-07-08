---
title: IHeader
product: Form Library
api-type: interface
description: "A survey header configuration interface. An `IHeader` object configures advanced survey header appearance settings. To apply them, you need to assign the object to the [`header`](https://surveyjs.io/form-library/documentation/api-reference/itheme#header) property of your theme configuration and set the [`headerView`](https://surveyjs.io/form-library/documentation/api-reference/itheme#headerView) property to `\"advanced\"`."
source: 
---

# `IHeader`

A survey header configuration interface.

An `IHeader` object configures advanced survey header appearance settings. To apply them, you need to assign the object to the [`header`](https://surveyjs.io/form-library/documentation/api-reference/itheme#header) property of your theme configuration and set the [`headerView`](https://surveyjs.io/form-library/documentation/api-reference/itheme#headerView) property to `"advanced"`.

## Properties

### `height`

The height of the survey header in pixels.

Default value: 256

**Type**: `number`

### `mobileHeight`

The height of the survey header on smartphones, measured in pixels.

Default value: 0 (the height is calculated automatically to accommodate the header's content).

**Type**: `number`

### `inheritWidthFrom`

A string value that specifies whether the header spans the width of the survey or that of the survey container.

Possible values:

- `"survey"`\
The header width is the same as the survey width.
- `"container"` (default)\
The header width is the same as the survey container width.

**Type**: `"survey" | "container"`

### `textAreaWidth`

The width of the header area that contains the survey [title](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) and [description](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description), measured in pixels.

Default value: 512

**Type**: `number`

### `overlapEnabled`

A Boolean value that specifies whether the header overlaps the survey content.

Default value: `false`

**Type**: `boolean`

### `backgroundImage`

An image to display in the background of the header. Accepts a base64 or URL string value.

**Type**: `string`

### `backgroundImageOpacity`

A value from 0 to 1 that specifies how transparent the [background image](#backgroundImage) should be: 0 makes the image completely transparent, and 1 makes it opaque.

**Type**: `number`

### `backgroundImageFit`

A string value that specifies how to resize a [background image](#backgroundImage) to fit it into the header.

Possible values:

- `"cover"` (default)\
Scales the image to the smallest possible size that fills the header. The image preserves its aspect ratio but can be cropped if the header's proportions differ from that of the element.
- `"fill"`\
Stretches the image to fill the entire header.
- `"contain"`\
Scales the image to the largest possible size without cropping or stretching it.
- `"tile"`\
Tiles as many copies of the image as needed to fill the entire header.

**Type**: `"contain" | "cover" | "fill" | "tile"`

### `logoPositionX`

A string value that specifies the logo position within the header in the horizontal direction.

Possible values:

- `"right"` (default)
- `"left"`
- `"center"`

To specify a logo, set `SurveyModel`'s [`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo) property.

**Type**: `HorizontalAlignment`

### `logoPositionY`

A string value that specifies the logo position within the header in the vertical direction.

Possible values:

- `"top"` (default)
- `"bottom"`
- `"middle"`

To specify a logo, set `SurveyModel`'s [`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo) property.

**Type**: `VerticalAlignment`

### `titlePositionX`

A string value that specifies the survey title position within the header in the horizontal direction.

Possible values:

- `"left"` (default)
- `"right"`
- `"center"`

To specify a survey title, set `SurveyModel`'s [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) property.

**Type**: `HorizontalAlignment`

### `titlePositionY`

A string value that specifies the survey title position within the header in the vertical direction.

Possible values:

- `"bottom"` (default)
- `"top"`
- `"middle"`

To specify a survey title, set `SurveyModel`'s [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) property.

**Type**: `VerticalAlignment`

### `descriptionPositionX`

A string value that specifies the survey description position within the header in the horizontal direction.

Possible values:

- `"left"` (default)
- `"right"`
- `"center"`

To specify a survey description, set `SurveyModel`'s [`description`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description) property.

**Type**: `HorizontalAlignment`

### `descriptionPositionY`

A string value that specifies the survey description position within the header in the vertical direction.

Possible values:

- `"bottom"` (default)
- `"top"`
- `"middle"`

To specify a survey description, set `SurveyModel`'s [`description`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description) property.

**Type**: `VerticalAlignment`
