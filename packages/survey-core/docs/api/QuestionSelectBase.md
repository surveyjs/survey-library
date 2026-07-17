---
title: QuestionSelectBase
product: Form Library
api-type: class
description: A base class for multiple-choice question types (Checkboxes, Dropdown, Radio Button Group, etc.).
source: https://surveyjs.io/form-library/documentation/api-reference/questionselectbase
---

# `QuestionSelectBase`

A base class for multiple-choice question types ([Checkboxes](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Radio Button Group](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), etc.).

## Inheritance

[`Base`](https://surveyjs.io/form-library/documentation/api-reference/base.md) &rarr; [`SurveyElementCore`](https://surveyjs.io/form-library/documentation/api-reference/surveyelementcore.md) &rarr; [`SurveyElement`](https://surveyjs.io/form-library/documentation/api-reference/surveyelement.md) &rarr; [`Question`](https://surveyjs.io/form-library/documentation/api-reference/question.md) &rarr; `QuestionSelectBase`

## Properties

### `choices`

**Type**: `any[]`

Gets or sets choice items. This property accepts an array of objects with the following structure:

```js
{
  "value": any, // A unique value to be saved in the survey results.
  "text": string, // A display text. This property supports Markdown. When `text` is undefined, `value` is used.
  "imageLink": string // A link to the image or video that represents this choice value. Applies only to Image Picker questions.
  "customProperty": any // Any property that you find useful.
}
```

To enable Markdown support for the `text` property, implement Markdown-to-HTML conversion in the [`onTextMarkdown`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onTextMarkdown) event handler. For an example, refer to the following demo: [Convert Markdown to HTML with markdown-it](https://surveyjs.io/form-library/examples/edit-survey-questions-markdown/).

If you add custom properties, refer to the following help topic to learn how to serialize them into JSON: [Add Custom Properties to Property Grid](https://surveyjs.io/survey-creator/documentation/property-grid#add-custom-properties-to-the-property-grid).

If you need to specify only the `value` property, you can set the `choices` property to an array of primitive values, for example, `[ "item1", "item2", "item3" ]`. These values are both saved in survey results and used as display text.

[Dropdown Demo](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/ (linkStyle))

[Checkboxes Demo](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/ (linkStyle))

[Radio Button Group Demo](https://surveyjs.io/form-library/examples/single-select-radio-button-group/ (linkStyle))

[Ranking Demo](https://surveyjs.io/form-library/examples/add-ranking-question-to-form/ (linkStyle))

[Image Picker Demo](https://surveyjs.io/form-library/examples/image-picker-question/ (linkStyle))

[Conditionally Display Choice Options](https://surveyjs.io/form-library/examples/how-to-conditionally-display-choice-options/ (linkStyle))

**Related APIs:** [`choicesByUrl`](#choicesByUrl), [`choicesFromQuestion`](#choicesFromQuestion), [`[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder)`](#[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder))

### `choicesByUrl`

**Type**: `ChoicesRestful`

Configures access to a RESTful service that returns choice items. Refer to the [`ChoicesRestful`](https://surveyjs.io/form-library/documentation/choicesrestful) class description for more information. You can also specify additional application-wide settings using the [`settings.web`](https://surveyjs.io/form-library/documentation/api-reference/settings#web) object.

[View Demo](https://surveyjs.io/form-library/examples/dropdown-menu-load-data-from-restful-service/ (linkStyle))

**Related APIs:** [`choices`](#choices), [`[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder)`](#[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder))

### `choicesEnableIf`

**Type**: `string`

A Boolean expression that is evaluated against each choice item. If the expression evaluates to `false`, the choice item becomes read-only.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Use the `{item}` placeholder to reference the current choice item in the expression.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Related APIs:** [`enableIf`](#enableIf), [`choicesVisibleIf`](#choicesVisibleIf)

### `choicesFromQuestion`

**Type**: `string`

Copies choice items from a specified question. Accepts a question name.

If you specify this property, the [`choices`](#choices), [`choicesVisibleIf`](#choicesVisibleIf), [`choicesEnableIf`](#choicesEnableIf), and [`choicesOrder`](#choicesEnableIf) properties do not apply because their values are copied.

In addition, you can specify the [`choicesFromQuestionMode`](#choicesFromQuestionMode) property if you do not want to copy all choice items.

[View Demo](https://surveyjs.io/form-library/examples/carry-forward-responses/ (linkStyle))

### `choicesFromQuestionMode`

**Type**: `string`

Specifies which choice items to copy from another question. Applies only when the [`choicesFromQuestion`](#choicesFromQuestion) property is specified.

Possible values:

- `"all"` (default) - Copies all choice items.
- `"selected"` - Copies only selected choice items.
- `"unselected"` - Copies only unselected choice items.

[View Demo](https://surveyjs.io/form-library/examples/carry-forward-responses/ (linkStyle))

> Use the [`visibleChoices`](#visibleChoices) property to access copied choice items in code.

### `choicesOrder`

**Type**: `string`

Specifies the sort order of choice items.

Possible values:

- `"none"` (default) - Preserves the original order of choice items.
- `"asc"`- Sorts choice items in ascending order.
- `"desc"`- Sorts choice items in ascending order.
- `"random"` - Displays choice items in random order.

**Related APIs:** [`[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder)`](#[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder))

### `choicesVisibleIf`

**Type**: `string`

A Boolean expression that is evaluated against each choice item. If the expression evaluates to `false`, the choice item becomes hidden.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Use the `{item}` placeholder to reference the current choice item in the expression.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Related APIs:** [`visibleIf`](#visibleIf), [`choicesEnableIf`](#choicesEnableIf)

### `choiceTextsFromQuestion`

**Type**: `string`

Specifies which matrix column or dynamic panel question supplies choice texts. Use this property to construct choice items based on cell values in Dynamic Matrix and question values in Dynamic Panel.

Each choice item consists of a value saved in survey results and a text displayed in the UI. To construct a choice item, assign the `name` of a Dynamic Matrix or Dynamic Panel to the [`choicesFromQuestion`](#choicesFromQuestion) property and specify which dynamic panel question or matrix column supplies values and which provides texts. Use the [`choiceValuesFromQuestion`](#choiceValuesFromQuestion) and `choiceTextsFromQuestion` properties for this purpose. If a choice text is empty, a choice value is used as a display text and saved in survey results.

[View Demo](https://surveyjs.io/form-library/examples/pipe-answers-from-dynamic-matrix-or-panel/ (linkStyle))

### `choiceValuesFromQuestion`

**Type**: `string`

Specifies which matrix column or dynamic panel question supplies choice values. Use this property to construct choice items based on cell values in Dynamic Matrix and question values in Dynamic Panel.

Each choice item consists of a value saved in survey results and a text displayed in the UI. To construct a choice item, assign the `name` of a Dynamic Matrix or Dynamic Panel to the [`choicesFromQuestion`](#choicesFromQuestion) property and specify which dynamic panel question or matrix column supplies values and which provides texts. Use the `choiceValuesFromQuestion` and [`choiceTextsFromQuestion`](#choiceTextsFromQuestion) properties for this purpose. If a choice text is empty, a choice value is used as a display text and saved in survey results.

[View Demo](https://surveyjs.io/form-library/examples/pipe-answers-from-dynamic-matrix-or-panel/ (linkStyle))

### `customChoices`

**Type**: `any[]`

An array of choice items that were added by a user. Applies only if the [`allowCustomChoices`](#allowCustomChoices) is set to `true` for this question.

> Custom choices will only be stored temporarily for the duration of the current browser session. If you want to save them in a database or another data storage, handle the [`onCreateCustomChoiceItem`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCreateCustomChoiceItem) event.

### `dontKnowItem`

**Type**: `ItemValue`

Returns the "Don't know" choice item. Use this property to change the item's `value` or `text`.

**Related APIs:** [`showDontKnowItem`](#showDontKnowItem)

### `dontKnowText`

**Type**: `string`

Gets or sets a caption for the "Don't know" choice item.

**Related APIs:** [`showDontKnowItem`](#showDontKnowItem)

### `enabledChoices`

**Type**: `ItemValue[]`

An array of choice items with which users can interact. Includes the "Select All", "Other", and "None" choice items if they are not disabled. Items are sorted according to the `choicesOrder` value.

**Related APIs:** [`showNoneItem`](#showNoneItem), [`showOtherItem`](#showOtherItem), [`choicesOrder`](#choicesOrder), [`choices`](#choices), [`visibleChoices`](#visibleChoices)

### `hideIfChoicesEmpty`

**Type**: `boolean`

Specifies whether to hide the question if no choice items are visible.

This property is useful if you show or hide choice items at runtime based on a [condition](https://surveyjs.io/form-library/documentation/questionselectbase#choicesVisibleIf).

### `isOtherSelected`

**Type**: `boolean`

Returns `true` if the "Other" choice item is selected.

**Related APIs:** [`showOtherItem`](#showOtherItem)

### `itemComponent`

**Type**: `string`

The name of a component used to render items.

[Dropdown Demo](https://surveyjs.io/form-library/examples/dropdown-box-with-custom-items/ (linkStyle))

[Ranking Demo](https://surveyjs.io/form-library/examples/ranking-with-custom-items/ (linkStyle))

[Checkboxes and Radio Button Group Demo](https://surveyjs.io/form-library/examples/add-custom-items-to-single-and-multi-select-questions/ (linkStyle))

### `keepIncorrectValues`

**Type**: `boolean`

Specifies whether to keep values that cannot be assigned to this question, for example, choices unlisted in the `choices` array.

> This property cannot be specified in the survey JSON schema. Use dot notation to specify it.

**Related APIs:** [`clearIncorrectValues`](#clearIncorrectValues)

### `noneItem`

**Type**: `ItemValue`

Returns the "None" choice item. Use this property to change the item's `value` or `text`.

**Related APIs:** [`showNoneItem`](#showNoneItem)

### `noneText`

**Type**: `string`

Gets or sets a caption for the "None" choice item.

**Related APIs:** [`showNoneItem`](#showNoneItem)

### `otherErrorText`

**Type**: `string`

Gets or sets an error message displayed when users select the "Other" choice item but leave the comment area empty.

**Related APIs:** [`showOtherItem`](#showOtherItem)

### `otherItem`

**Type**: `ItemValue`

Returns the "Other" choice item. Use this property to change the item's `value` or `text`.

**Related APIs:** [`showOtherItem`](#showOtherItem)

### `otherPlaceholder`

**Type**: `string`

A placeholder for the comment area. Applies when the `showOtherItem` or `showCommentArea` property is `true`.

**Related APIs:** [`showOtherItem`](#showOtherItem), [`showCommentArea`](#showCommentArea)

### `otherText`

**Type**: `string`

Gets or sets a caption for the "Other" choice item.

**Related APIs:** [`showOtherItem`](#showOtherItem)

### `refuseItem`

**Type**: `ItemValue`

Returns the "Refuse to answer" choice item. Use this property to change the item's `value` or `text`.

**Related APIs:** [`showRefuseItem`](#showRefuseItem)

### `refuseText`

**Type**: `string`

Gets or sets a caption for the "Refuse to answer" choice item.

**Related APIs:** [`showRefuseItem`](#showRefuseItem)

### `separateSpecialChoices`

**Type**: `boolean`

Displays the "Select All", "None", and "Other" choices on individual rows.

[Checkboxes Demo](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/ (linkStyle))

[Radio Button Group Demo](https://surveyjs.io/form-library/examples/single-select-radio-button-group/ (linkStyle))

**Related APIs:** [`showNoneItem`](#showNoneItem), [`showOtherItem`](#showOtherItem), [`[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder)`](#[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder))

### `showDontKnowItem`

**Type**: `boolean`

Specifies whether to display the "Don't know" choice item.

When users select the "Don't know" item in multi-select questions, all other items become unselected.

**Related APIs:** [`dontKnowItem`](#dontKnowItem), [`dontKnowItemText`](#dontKnowItemText), [`[settings.dontKnowItemValue](https://surveyjs.io/form-library/documentation/api-reference/settings#dontKnowItemValue)`](#[settings.dontKnowItemValue](https://surveyjs.io/form-library/documentation/api-reference/settings#dontKnowItemValue)), [`[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder)`](#[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder))

### `showNoneItem`

**Type**: `boolean`

Specifies whether to display the "None" choice item.

When users select the "None" item in multi-select questions, all other items become unselected.

[Dropdown Demo](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/ (linkStyle))

[Checkboxes Demo](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/ (linkStyle))

[Radio Button Group Demo](https://surveyjs.io/form-library/examples/single-select-radio-button-group/ (linkStyle))

**Related APIs:** [`noneItem`](#noneItem), [`noneText`](#noneText), [`[settings.noneItemValue](https://surveyjs.io/form-library/documentation/api-reference/settings#noneItemValue)`](#[settings.noneItemValue](https://surveyjs.io/form-library/documentation/api-reference/settings#noneItemValue)), [`[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder)`](#[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder))

### `showOtherItem`

**Type**: `boolean`

Specifies whether to display the "Other" choice item.

[Dropdown Demo](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/ (linkStyle))

[Checkboxes Demo](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/ (linkStyle))

[Radio Button Group Demo](https://surveyjs.io/form-library/examples/single-select-radio-button-group/ (linkStyle))

**Related APIs:** [`otherText`](#otherText), [`otherItem`](#otherItem), [`otherErrorText`](#otherErrorText), [`showCommentArea`](#showCommentArea), [`[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder)`](#[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder))

### `showRefuseItem`

**Type**: `boolean`

Specifies whether to display the "Refuse to answer" choice item.

When users select the "Refuse to answer" item in multi-select questions, all other items become unselected.

**Related APIs:** [`refuseItem`](#refuseItem), [`refuseItemText`](#refuseItemText), [`[settings.refuseItemValue](https://surveyjs.io/form-library/documentation/api-reference/settings#refuseItemValue)`](#[settings.refuseItemValue](https://surveyjs.io/form-library/documentation/api-reference/settings#refuseItemValue)), [`[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder)`](#[settings.specialChoicesOrder](https://surveyjs.io/form-library/documentation/api-reference/settings#specialChoicesOrder))

### `visibleChoices`

**Type**: `ChoiceItem[]`

An array of visible choice items. Includes the "Select All", "Other", and "None" choice items if they are visible. Items are sorted according to the `choicesOrder` value.

**Related APIs:** [`showNoneItem`](#showNoneItem), [`showOtherItem`](#showOtherItem), [`choicesOrder`](#choicesOrder), [`choices`](#choices), [`enabledChoices`](#enabledChoices)

## Methods

### `isItemSelected()`

**Return value:** `boolean`

Returns `true` if a passed choice item is selected.

To obtain a choice item to check, use the `noneItem` or `otherItem` property or the `choices` array.

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` | A choice item. |

**Related APIs:** [`noneItem`](#noneItem), [`otherItem`](#otherItem), [`choices`](#choices)
