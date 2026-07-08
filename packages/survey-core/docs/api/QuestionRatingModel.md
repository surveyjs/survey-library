---
title: QuestionRatingModel
product: Form Library
api-type: class
description: A class that describes the Rating Scale question type.
source: https://surveyjs.io/form-library/documentation/api-reference/questionratingmodel
---

# `QuestionRatingModel`

A class that describes the Rating Scale question type.

[View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionRatingModel`

## Properties

### `displayMode`

Specifies whether to display rate values as buttons or items in a drop-down list.

Possible values:

- `"buttons"` - Displays rate values as buttons in a row.
- `"dropdown"` - Displays rate values as items in a drop-down list.
- `"auto"` (default) - Selects between the `"buttons"` and `"dropdown"` modes based on the available width. When the width is insufficient to display buttons, the question displays a dropdown.

[View Demo](https://surveyjs.io/form-library/examples/ui-adaptation-modes-for-rating-scale/ (linkStyle))

**Type**: `"auto" | "dropdown" | "buttons"`

### `displayRateDescriptionsAsExtremeItems`

Specifies whether to display [`minRateDescription`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#minRateDescription) and [`maxRateDescription`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#maxRateDescription) values as captions for buttons that correspond to the extreme (first and last) rate values.

Default value: `false`

If this property is disabled, the `minRateDescription` and `maxRateDescription` values are displayed as plain non-clickable texts.

If any of the `minRateDescription` and `maxRateDescription` properties is empty, the corresponding rate value's `value` or `text` is displayed as a button caption.

**Type**: `boolean`

### `itemComponent`

The name of a component used to render items.

**Type**: `string`

### `maxRateDescription`

Specifies a description for the maximum (last) rate value.

**Type**: `string`

### `minRateDescription`

Specifies a description for the minimum (first) rate value.

**Type**: `string`

### `rateColorMode`

Specifies how to colorize the selected emoji. Applies only if [`rateType`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateType) is `"smileys"`.

Possible values:

- `"default"` - Displays the selected emoji in default survey color.
- `"scale"` (default) - Inherits the color from the scale.

**Type**: `"default" | "scale"`

### `rateCount`

Specifies the number of rate values you want to generate. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.

Set the [`rateMin`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMin) or [`rateMax`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMax) property to specify the first or the last rate value. Use the [`rateStep`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateStep) property to specify a step with which to generate rate values.

[View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))

**Type**: `number`

### `rateDescriptionLocation`

Specifies the alignment of [`minRateDescription`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#minRateDescription) and [`maxRateDescription`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#maxRateDescription) texts.

Possible values:

- `"leftRight"` (default) - Aligns `minRateDescription` to the left of rate values and `maxRateDescription` to their right.
- `"top"` - Displays the descriptions above the minimum and maximum rate values.
- `"bottom"` - Displays both descriptions below the minimum and maximum rate values.
- `"topBottom"` - Displays `minRateDescription` above the minimum rate value and `maxRateDescription` below the maximum rate value.

**Type**: `"top" | "bottom" | "topBottom" | "leftRight"`

### `rateMax`

Specifies the last rate value in the generated sequence of rate values. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.

Default value: 5

[View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))

**Type**: `number`

### `rateMin`

Specifies the first rate value in the generated sequence of rate values. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.

Default value: 1

[View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))

**Type**: `number`

### `rateStep`

Specifies a step with which to generate rate values. Applies if the [`rateValues`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateValues) array is empty.

Default value: 1

[View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))

**Type**: `number`

### `rateType`

Specifies the visual representation of rate values.

Possible values:

- `"labels"` (default) - Displays rate values as buttons with labels.
- `"stars"` - Displays rate values as stars.
- `"smileys"` - Displays rate values as smiley faces.

[View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))

**Type**: `"labels" | "stars" | "smileys"`

### `rateValues`

A list of rate values.

This property accepts an array of objects with the following structure:

```js
{
  "value": any, // A value to be saved in survey results
  "text": string, // A display text. This property supports Markdown. When `text` is undefined, `value` is used.
  "customProperty": any // Any property that you find useful.
}
```

If you add custom properties, refer to the following help topic to learn how to serialize them into JSON: [Add Custom Properties to Property Grid](https://surveyjs.io/survey-creator/documentation/property-grid#add-custom-properties-to-the-property-grid).

To enable Markdown support for the `text` property, implement Markdown-to-HTML conversion in the [onTextMarkdown](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onTextMarkdown) event handler. For an example, refer to the following demo: [Convert Markdown to HTML with markdown-it](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/).

If you need to specify only the `value` property, you can set the `rateValues` property to an array of numbers, for example, `[ 3, 6, 10 ]`. These values are both saved in survey results and used as display text.

If you do not specify the `rateValues` property, rate values are generated automatically based upon the [`rateMin`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMin), [`rateMax`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateMax), [`rateStep`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateStep), and [`rateCount`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateCount) property values.

[View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))

**Type**: `any[]`

### `scaleColorMode`

Specifies how to colorize the smiley face rating scale. Applies only if [`rateType`](https://surveyjs.io/form-library/documentation/api-reference/rating-scale-question-model#rateType) is `"smileys"`.

Possible values:

- `"monochrome"` (default) - Displays emojis in monochrome.
- `"colored"` - Displays emojis in color.

[View Demo](https://surveyjs.io/form-library/examples/rating-scale/ (linkStyle))

**Type**: `"monochrome" | "colored"`
