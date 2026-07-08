---
title: ITheme
product: Form Library
api-type: interface
description: A theme configuration interface.
source: https://surveyjs.io/form-library/documentation/api-reference/itheme
---

# `ITheme`

A theme configuration interface.

`ITheme` objects are used to apply predefined themes or create custom themes. Refer to the following help topic for more information:

[Themes & Styles](https://surveyjs.io/form-library/documentation/manage-default-themes-and-styles (linkStyle))

## Properties

### `backgroundImage`

An image to display as survey background. This property accepts a hyperlink or a data URL.

**Type**: `string`

### `backgroundImageAttachment`

A string value that specifies whether the [background image](#backgroundImage) is fixed in its position or scrolled along with the survey.

Possible values:

- `"fixed"`
- `"scroll"`

**Type**: `"fixed" | "scroll"`

### `backgroundImageFit`

A string value that specifies how to resize the [background image](#backgroundImage) to fit it into its container.

Possible values:

- `"auto"`
- `"contain"`
- `"cover"`

Refer to the description of the [`background-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size#values) CSS property values on MDN for detailed information on the possible values.

**Type**: `"auto" | "contain" | "cover"`

### `backgroundOpacity`

A value from 0 to 1 that specifies how transparent the [background image](#backgroundImage) should be: 0 makes the image completely transparent, and 1 makes it opaque.

**Type**: `number`

### `colorPalette`

A color palette.

Possible values:

- `"light"`
- `"dark"`

**Type**: `string`

### `cssVariables`

An object with CSS variables.

**Type**: `{ [index: string]: string; }`

### `header`

An object with [advanced survey header settings](https://surveyjs.io/form-library/documentation/api-reference/iheader). Applies when the [`headerView`](https://surveyjs.io/form-library/documentation/api-reference/itheme#headerView) property is set to `"advanced"`.

**Type**: `IHeader`

### `headerView`

Specifies whether the survey header uses only basic appearance settings or applies advanced settings from the survey theme.

Possible values:

- `"basic"` (default)\
A basic header view applies only the [`title`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#title), [`description`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#description), and logo-related properties ([`logo`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logo), [`logoPosition`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#logoPosition), etc.).

- `"advanced"`\
An advanced header view applies the same properties as the basic view, plus [header settings](https://surveyjs.io/form-library/documentation/api-reference/iheader) from the [survey theme](https://surveyjs.io/form-library/documentation/api-reference/itheme#header). The advanced view features a more flexible header layout, a capability to specify a background image, and other settings that give a more professional look to the survey header.

[View Demo](https://surveyjs.io/form-library/examples/brand-your-survey-header/ (linkStyle))

**Type**: `"advanced" | "basic"`

### `isPanelless`

A Boolean value that specifies whether survey questions are displayed within panels (`false`) or without them (`true`).

**Type**: `boolean`

### `themeName`

A theme name.

**Type**: `string`
