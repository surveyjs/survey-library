---
title: QuestionSliderModel
product: Form Library
api-type: class
description: "A class that describes the Slider question type. [View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle)) [View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))"
source: 
---

# `QuestionSliderModel`

A class that describes the Slider question type.

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSliderModel`

## Properties

### `sliderType`

Specifies whether the slider allows selecting a single value (`"single"`) or a value range (`"range"`).

Possible values:

- `"single"` (default)
- `"range"`

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

**Type**: `"range" | "single"`

### `max`

Defines the maximum value on the slider scale.

Default value: 100

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

**Type**: `number`

### `min`

Defines the minimum value on the slider scale.

Default value: 0

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

**Type**: `number`

### `maxValueExpression`

An expression that dynamically calculates the maximum scale value. Overrides the static [`max`](#max) property if defined.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

**Type**: `string`

### `minValueExpression`

An expression that dynamically calculates the minimum scale value. Overrides the static [`min`](#min) property if defined.

[Expressions](https://surveyjs.io/form-library/documentation/design-survey/conditional-logic#expressions (linkStyle))

**Type**: `string`

### `maxRangeLength`

Specifies the maximum length between the two thumbs of a range slider. Applies only if [`sliderType`](#sliderType) is `"range"`.

Default value: `null`

[View Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

**Type**: `number`

### `minRangeLength`

Specifies the minimum length between the two thumbs of a range slider. Applies only if [`sliderType`](#sliderType) is `"range"`.

Default value: `null`

[View Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

**Type**: `number`

### `tooltipFormat`

A formatting string for thumb tooltips. You can use `{0}` as a placeholder for a tooltip's numeric value.

Default value: `"{0}"`

**Type**: `string`

### `labelFormat`

A formatting string for [auto-generated](#labelCount) or [custom labels](#customLabels). You can use `{0}` as a placeholder for the label's numeric value.

Default value: `"{0}"`

[View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))

> If you are using custom labels, `labelFormat` affects only those that do not define the `text` property.

**Type**: `string`

### `tooltipVisibility`

Controls the visibility of thumb tooltips.

Possible values:

- `"auto"` (default) - Tooltips appear when the thumb or selected range is hovered or focused.
- `"always"`- Tooltips are always visible.
- `"never"` - Tooltips are never displayed.

**Type**: `"auto" | "always" | "never"`

### `step`

Sets the interval between selectable scale values.

Default value: 1

[View Slider Demo](https://surveyjs.io/form-library/examples/single-value-slider-input/ (linkStyle))

[View Range Slider Demo](https://surveyjs.io/form-library/examples/dual-range-slider-input/ (linkStyle))

**Type**: `number`

### `showLabels`

Specifies whether the slider displays value labels along the scale.

Default value: `true`

[View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))

**Type**: `boolean`

### `labelCount`

Defines how many auto-generated labels should be displayed along the slider scale. Ignored if the [`customLabels`](#customLabels) property is set.

Default value: -1 (the number of labels is calculated automatically based on the [`min`](#min) and [`max`](#max) values)

[View Demo](https://surveyjs.io/form-library/examples/customize-slider-scale-labels/ (linkStyle))

**Type**: `number`

### `autoGenerate`

**Type**: `boolean`

### `customLabels`

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

**Type**: `SliderLabelItemValue[]`

### `allowDragRange`

**Type**: `boolean`

### `tickSize`

**Type**: `number`

### `allowSwap`

Allows the start and end thumbs to cross over each other. If `false`, the thumbs cannot be swapped. Applies only if [`sliderType`](#sliderType) is `"range"`.

Default value: `false` if [`minRangeLength`](#minRangeLength) is defined, `true` otherwise.

**Type**: `boolean`

### `allowClear`

Specifies whether to display a button that clears the selected slider value and resets it to `undefined`.

Default value: `false`

**Type**: `boolean`

### `focusedThumb`

**Type**: `number`

### `animatedThumb`

**Type**: `boolean`

### `dragOrClickHelper`

**Type**: `DragOrClickHelper<any>`

### `generatedLabels`

**Type**: `ItemValue[]`

### `renderedValue`

**Type**: `number[]`

### `rootCss`

**Type**: `string`

### `getThumbContainerCss`

**Type**: `(thumbNumber: number) => string`

### `tooltipCss`

**Type**: `string`

### `getLabelCss`

**Type**: `(locText: LocalizableString) => string`

### `renderedLabelCount`

**Type**: `number`

### `renderedMax`

**Type**: `number`

### `renderedMin`

**Type**: `number`

### `renderedMaxRangeLength`

**Type**: `number`

### `renderedMinRangeLength`

**Type**: `number`

### `renderedLabels`

**Type**: `ItemValue[]`

### `isIndeterminate`

**Type**: `boolean`

### `isNegativeScale`

**Type**: `boolean`

### `getTrackPercentLeft`

**Type**: `() => number`

### `getTrackPercentRight`

**Type**: `() => number`

### `getPercent`

**Type**: `(value: number) => number`

### `ensureMaxRangeBorders`

**Type**: `(newValue: number, inputNumber: number) => number`

### `ensureMinRangeBorders`

**Type**: `(newValue: number, inputNumber: number) => number`

### `getClosestToStepValue`

**Type**: `(value: number) => number`

### `handleRangeOnChange`

**Type**: `(event: any) => void`

### `prepareInputRangeForMoving`

**Type**: `(event: any, questionRootNode: any) => void`

### `handleRangePointerDown`

**Type**: `(event: any, rootNode: any) => void`

### `handleRangePointerUp`

**Type**: `(event: any, rootNode: any) => void`

### `refreshInputRange`

**Type**: `(inputRef?: any) => void`

### `setSliderValue`

**Type**: `(newValue: number | number[]) => void`

### `setValueByClickOnPath`

**Type**: `(event: any, rootNode: any) => void`

### `setValueByClick`

**Type**: `(newValue: number, inputNode?: any) => void`

### `handleOnChange`

**Type**: `(event: any, inputNumber: number) => void`

### `handlePointerDown`

**Type**: `(e: any) => void`

### `handlePointerUp`

**Type**: `(event: any) => void`

### `handleKeyDown`

**Type**: `(event: any) => void`

### `handleKeyUp`

**Type**: `(event: any) => void`

### `handleOnFocus`

**Type**: `(inputNumber: number) => void`

### `handleOnBlur`

**Type**: `() => void`

### `handleLabelPointerUp`

**Type**: `(event: any, newValue: number) => void`

### `getTooltipValue`

**Type**: `(tooltipNumber: number) => string`

### `getLabelText`

**Type**: `(labelNumber: number) => string`

### `getLabelPosition`

**Type**: `(labelNumber: number) => number`

### `isRangeMoving`

**Type**: `boolean`

### `oldInputValue`

**Type**: `number`

### `oldValue`

**Type**: `number | number[]`

### `calcRenderedValue`

**Type**: `() => number[]`

### `questionRootElement`

**Type**: `any`

## Methods

### `getType()`

**Return value:** `string`

### `getTextByItem()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `endLoadingFromJson()`

### `updateValueFromSurvey()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newValue` | `any` |  |
| `clearData` | `boolean` |  |

### `itemValuePropertyChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |
| `name` | `string` |  |
| `oldValue` | `any` |  |
| `newValue` | `any` |  |

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
