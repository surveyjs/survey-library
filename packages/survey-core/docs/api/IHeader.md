---
title: IHeader
product: Form Library
api-type: interface
description: A survey header configuration interface.
source: https://surveyjs.io/form-library/documentation/api-reference/iheader
---

# `IHeader`

A survey header configuration interface.

An `IHeader` object configures advanced survey header appearance settings. To apply them, you need to assign the object to the [`header`](https://surveyjs.io/form-library/documentation/api-reference/itheme#header) property of your theme configuration and set the [`headerView`](https://surveyjs.io/form-library/documentation/api-reference/itheme#headerView) property to `"advanced"`.

## Properties

### `backgroundImage`

**Type**: `string`

An image to display in the background of the header. Accepts a base64 or URL string value.

### `backgroundImageFit`

**Type**: `"contain" | "cover" | "fill" | "tile"`

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

### `backgroundImageOpacity`

**Type**: `number`

A value from 0 to 1 that specifies how transparent the [background image](#backgroundImage) should be: 0 makes the image completely transparent, and 1 makes it opaque.

### `descriptionPositionX`

**Type**: `HorizontalAlignment`

A string value that specifies the survey description position within the header in the horizontal direction.

Possible values:

- `"left"` (default)
- `"right"`
- `"center"`

To specify a survey description, set `SurveyModel`'s [`description`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description) property.

### `descriptionPositionY`

**Type**: `VerticalAlignment`

A string value that specifies the survey description position within the header in the vertical direction.

Possible values:

- `"bottom"` (default)
- `"top"`
- `"middle"`

To specify a survey description, set `SurveyModel`'s [`description`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description) property.

### `height`

**Type**: `number`

The height of the survey header in pixels.

Default value: 256

### `inheritWidthFrom`

**Type**: `"survey" | "container"`

A string value that specifies whether the header spans the width of the survey or that of the survey container.

Possible values:

- `"survey"`\
The header width is the same as the survey width.
- `"container"` (default)\
The header width is the same as the survey container width.

### `logoPositionX`

**Type**: `HorizontalAlignment`

A string value that specifies the logo position within the header in the horizontal direction.

Possible values:

- `"right"` (default)
- `"left"`
- `"center"`

To specify a logo, set `SurveyModel`'s [`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo) property.

### `logoPositionY`

**Type**: `VerticalAlignment`

A string value that specifies the logo position within the header in the vertical direction.

Possible values:

- `"top"` (default)
- `"bottom"`
- `"middle"`

To specify a logo, set `SurveyModel`'s [`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo) property.

### `mobileHeight`

**Type**: `number`

The height of the survey header on smartphones, measured in pixels.

Default value: 0 (the height is calculated automatically to accommodate the header's content).

### `overlapEnabled`

**Type**: `boolean`

A Boolean value that specifies whether the header overlaps the survey content.

Default value: `false`

### `textAreaWidth`

**Type**: `number`

The width of the header area that contains the survey [title](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) and [description](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description), measured in pixels.

Default value: 512

### `titlePositionX`

**Type**: `HorizontalAlignment`

A string value that specifies the survey title position within the header in the horizontal direction.

Possible values:

- `"left"` (default)
- `"right"`
- `"center"`

To specify a survey title, set `SurveyModel`'s [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) property.

### `titlePositionY`

**Type**: `VerticalAlignment`

A string value that specifies the survey title position within the header in the vertical direction.

Possible values:

- `"bottom"` (default)
- `"top"`
- `"middle"`

To specify a survey title, set `SurveyModel`'s [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title) property.
