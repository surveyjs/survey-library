---
title: QuestionSliderModel
product: Form Library
api-type: class
description: A class that describes the Slider question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionslidermodel
---

# `QuestionSliderModel`

A class that describes the Slider question type.

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

Available since: v2.1.0

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; `QuestionSliderModel`

## Properties

### `allowClear`

**Type**: `boolean`

Specifies whether to display a button that clears the selected slider value and resets it to `undefined`.

Default value: `false`

Available since: v2.1.0

### `allowSwap`

**Type**: `boolean`

Allows the start and end thumbs to cross over each other. If `false`, the thumbs cannot be swapped. Applies only if [`sliderType`](#sliderType) is `"range"`.

Default value: `false` if [`minRangeLength`](#minRangeLength) is defined, `true` otherwise.

Available since: v2.1.0

### `customLabels`

**Type**: `SliderLabelItemValue[]`

Specifies custom scale labels. Overrides auto-generated labels if defined.

This property accepts an array of numbers or objects with the following fields:

- `value`: `number`\
The scale value where the label should appear.

- `text`: `string`\
The label text to display.

- `showValue`: `boolean`\
Specifies whether to display the numeric value alongside the label text. Default value: `false`.

Numbers and objects can be combined in the same array. For instance, the following slider configuration adds textual labels for the minimum and maximum scale values and numeric labels for intermediate points. The extreme labels also display their corresponding values.

```js
const surveyJson = {
  "elements": [
    {
      "type": "slider",
      // ...
      "customLabels": [
        { "value": 0, "text": "Lowest", "showValue": true },
        20,
        40
        60
        80,
        { "value": 100, "text": "Highest", "showValue": true }
      ]
    }
  ]
};
```

[View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))

Available since: v2.1.0

**Related APIs:** [`showLabels`](#showLabels), [`labelCount`](#labelCount), [`labelFormat`](#labelFormat)

### `labelCount`

**Type**: `number`

Defines how many auto-generated labels should be displayed along the slider scale. Ignored if the [`customLabels`](#customLabels) property is set.

Default value: -1 (the number of labels is calculated automatically based on the [`min`](#min) and [`max`](#max) values)

[View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))

Available since: v2.1.0

**Related APIs:** [`showLabels`](#showLabels), [`labelFormat`](#labelFormat)

### `labelFormat`

**Type**: `string`

A formatting string for [auto-generated](#labelCount) or [custom labels](#customLabels). You can use `{0}` as a placeholder for the label's numeric value.

Default value: `"{0}"`

[View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))

> If you are using custom labels, `labelFormat` affects only those that do not define the `text` property.

Available since: v2.1.0

**Related APIs:** [`showLabels`](#showLabels), [`tooltipFormat`](#tooltipFormat)

### `max`

**Type**: `number`

Defines the maximum value on the slider scale.

Default value: 100

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

Available since: v2.1.0

**Related APIs:** [`maxValueExpression`](#maxValueExpression)

### `maxRangeLength`

**Type**: `number`

Specifies the maximum length between the two thumbs of a range slider. Applies only if [`sliderType`](#sliderType) is `"range"`.

Default value: `null`

[View Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

Available since: v2.1.0

### `maxValueExpression`

**Type**: `string`

An expression that dynamically calculates the maximum scale value. Overrides the static [`max`](#max) property if defined.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

Available since: v2.1.0

### `min`

**Type**: `number`

Defines the minimum value on the slider scale.

Default value: 0

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

Available since: v2.1.0

**Related APIs:** [`minValueExpression`](#minValueExpression)

### `minRangeLength`

**Type**: `number`

Specifies the minimum length between the two thumbs of a range slider. Applies only if [`sliderType`](#sliderType) is `"range"`.

Default value: `null`

[View Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

Available since: v2.1.0

### `minValueExpression`

**Type**: `string`

An expression that dynamically calculates the minimum scale value. Overrides the static [`min`](#min) property if defined.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

Available since: v2.1.0

### `showLabels`

**Type**: `boolean`

Specifies whether the slider displays value labels along the scale.

Default value: `true`

[View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))

Available since: v2.1.0

**Related APIs:** [`labelCount`](#labelCount), [`customLabels`](#customLabels), [`labelFormat`](#labelFormat)

### `sliderType`

**Type**: `"range" | "single"`

Specifies whether the slider allows selecting a single value (`"single"`) or a value range (`"range"`).

Possible values:

- `"single"` (default)
- `"range"`

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

Available since: v2.1.0

### `step`

**Type**: `number`

Sets the interval between selectable scale values.

Default value: 1

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

Available since: v2.1.0

### `tooltipFormat`

**Type**: `string`

A formatting string for thumb tooltips. You can use `{0}` as a placeholder for a tooltip's numeric value.

Default value: `"{0}"`

Available since: v2.1.0

**Related APIs:** [`tooltipVisibility`](#tooltipVisibility)

### `tooltipVisibility`

**Type**: `"auto" | "always" | "never"`

Controls the visibility of thumb tooltips.

Possible values:

- `"auto"` (default) - Tooltips appear when the thumb or selected range is hovered or focused.
- `"always"`- Tooltips are always visible.
- `"never"` - Tooltips are never displayed.

Available since: v2.1.0

**Related APIs:** [`tooltipFormat`](#tooltipFormat)
