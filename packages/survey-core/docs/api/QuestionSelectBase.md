---
title: QuestionSelectBase
product: Form Library
api-type: class
description: "A base class for multiple-choice question types ([Checkboxes](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Radio Button Group](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), etc.)."
source: 
---

# `QuestionSelectBase`

A base class for multiple-choice question types ([Checkboxes](https://surveyjs.io/form-library/documentation/questioncheckboxmodel), [Dropdown](https://surveyjs.io/form-library/documentation/questiondropdownmodel), [Radio Button Group](https://surveyjs.io/form-library/documentation/questionradiogroupmodel), etc.).

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase`

## Properties

### `visibleChoicesChangedCallback`

**Type**: `() => void`

### `loadedChoicesFromServerCallback`

**Type**: `() => void`

### `renderedChoicesChangedCallback`

**Type**: `() => void`

### `choiceCallbacks`

**Type**: `ISurveyChoiceCallbacks`

### `commentAreaModelValues`

**Type**: `HashTable<TextAreaModel>`

### `filteredChoicesValue`

**Type**: `ItemValue[]`

### `otherItemValue`

**Type**: `ItemValue`

### `choicesFromUrl`

**Type**: `ItemValue[]`

### `cachedValueForUrlRequests`

**Type**: `any`

### `isChoicesLoaded`

**Type**: `boolean`

### `enableOnLoadingChoices`

**Type**: `boolean`

### `noneItemValue`

**Type**: `ItemValue`

### `refuseItemValue`

**Type**: `ItemValue`

### `dontKnowItemValue`

**Type**: `ItemValue`

### `newItemValue`

**Type**: `ItemValue`

### `canShowOptionItemCallback`

**Type**: `(item: ItemValue) => boolean`

### `waitingGetChoiceDisplayValueResponse`

**Type**: `boolean`

### `otherTextAreaModel`

**Type**: `TextAreaModel`

### `otherId`

**Type**: `string`

### `isUsingCarryForward`

**Type**: `boolean`

### `carryForwardQuestionType`

**Type**: `string`

### `isUsingRestful`

**Type**: `boolean`

### `prevOtherErrorValue`

**Type**: `string`

### `isSettingComment`

**Type**: `boolean`

### `otherValue`

**Type**: `string`

### `otherItem`

Returns the "Other" choice item. Use this property to change the item's `value` or `text`.

**Type**: `ItemValue`

### `isOtherSelected`

Returns `true` if the "Other" choice item is selected.

**Type**: `boolean`

### `isNoneSelected`

**Type**: `boolean`

### `commentPropertyValue`

**Type**: `string`

### `showNoneItem`

Specifies whether to display the "None" choice item.

When users select the "None" item in multi-select questions, all other items become unselected.

[Dropdown Demo](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/ (linkStyle))

[Checkboxes Demo](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/ (linkStyle))

[Radio Button Group Demo](https://surveyjs.io/form-library/examples/single-select-radio-button-group/ (linkStyle))

**Type**: `boolean`

### `hasNone`

**Type**: `boolean`

### `noneItem`

Returns the "None" choice item. Use this property to change the item's `value` or `text`.

**Type**: `ItemValue`

### `noneText`

Gets or sets a caption for the "None" choice item.

**Type**: `string`

### `showRefuseItem`

Specifies whether to display the "Refuse to answer" choice item.

When users select the "Refuse to answer" item in multi-select questions, all other items become unselected.

**Type**: `boolean`

### `refuseItem`

Returns the "Refuse to answer" choice item. Use this property to change the item's `value` or `text`.

**Type**: `ItemValue`

### `refuseText`

Gets or sets a caption for the "Refuse to answer" choice item.

**Type**: `string`

### `showDontKnowItem`

Specifies whether to display the "Don't know" choice item.

When users select the "Don't know" item in multi-select questions, all other items become unselected.

**Type**: `boolean`

### `dontKnowItem`

Returns the "Don't know" choice item. Use this property to change the item's `value` or `text`.

**Type**: `ItemValue`

### `dontKnowText`

Gets or sets a caption for the "Don't know" choice item.

**Type**: `string`

### `choicesVisibleIf`

A Boolean expression that is evaluated against each choice item. If the expression evaluates to `false`, the choice item becomes hidden.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Use the `{item}` placeholder to reference the current choice item in the expression.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `string`

### `choicesEnableIf`

A Boolean expression that is evaluated against each choice item. If the expression evaluates to `false`, the choice item becomes read-only.

A survey parses and runs all expressions on startup. If any values used in the expression change, the survey re-evaluates it.

Use the `{item}` placeholder to reference the current choice item in the expression.

Refer to the following help topic for more information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `string`

### `autoOtherMode`

**Type**: `boolean`

### `renderedValue`

**Type**: `any`

### `makeCommentEmpty`

**Type**: `boolean`

### `clearIncorrectValuesCallback`

**Type**: `() => void`

### `customChoices`

An array of choice items that were added by a user. Applies only if the [`allowCustomChoices`](#allowCustomChoices) is set to `true` for this question.

> Custom choices will only be stored temporarily for the duration of the current browser session. If you want to save them in a database or another data storage, handle the [`onCreateCustomChoiceItem`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onCreateCustomChoiceItem) event.

**Type**: `any[]`

### `choicesByUrl`

Configures access to a RESTful service that returns choice items. Refer to the [`ChoicesRestful`](https://surveyjs.io/form-library/documentation/choicesrestful) class description for more information. You can also specify additional application-wide settings using the [`settings.web`](https://surveyjs.io/form-library/documentation/api-reference/settings#web) object.

[View Demo](https://surveyjs.io/form-library/examples/dropdown-menu-load-data-from-restful-service/ (linkStyle))

**Type**: `ChoicesRestful`

### `isChoicesUrlEmpty`

**Type**: `boolean`

### `choices`

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

**Type**: `any[]`

### `choicesFromQuestion`

Copies choice items from a specified question. Accepts a question name.

If you specify this property, the [`choices`](#choices), [`choicesVisibleIf`](#choicesVisibleIf), [`choicesEnableIf`](#choicesEnableIf), and [`choicesOrder`](#choicesEnableIf) properties do not apply because their values are copied.

In addition, you can specify the [`choicesFromQuestionMode`](#choicesFromQuestionMode) property if you do not want to copy all choice items.

[View Demo](https://surveyjs.io/form-library/examples/carry-forward-responses/ (linkStyle))

**Type**: `string`

### `isLockVisibleChoices`

**Type**: `boolean`

### `choicesFromQuestionMode`

Specifies which choice items to copy from another question. Applies only when the [`choicesFromQuestion`](#choicesFromQuestion) property is specified.

Possible values:

- `"all"` (default) - Copies all choice items.
- `"selected"` - Copies only selected choice items.
- `"unselected"` - Copies only unselected choice items.

[View Demo](https://surveyjs.io/form-library/examples/carry-forward-responses/ (linkStyle))

> Use the [`visibleChoices`](#visibleChoices) property to access copied choice items in code.

**Type**: `string`

### `choiceValuesFromQuestion`

Specifies which matrix column or dynamic panel question supplies choice values. Use this property to construct choice items based on cell values in Dynamic Matrix and question values in Dynamic Panel.

Each choice item consists of a value saved in survey results and a text displayed in the UI. To construct a choice item, assign the `name` of a Dynamic Matrix or Dynamic Panel to the [`choicesFromQuestion`](#choicesFromQuestion) property and specify which dynamic panel question or matrix column supplies values and which provides texts. Use the `choiceValuesFromQuestion` and [`choiceTextsFromQuestion`](#choiceTextsFromQuestion) properties for this purpose. If a choice text is empty, a choice value is used as a display text and saved in survey results.

[View Demo](https://surveyjs.io/form-library/examples/pipe-answers-from-dynamic-matrix-or-panel/ (linkStyle))

**Type**: `string`

### `choiceTextsFromQuestion`

Specifies which matrix column or dynamic panel question supplies choice texts. Use this property to construct choice items based on cell values in Dynamic Matrix and question values in Dynamic Panel.

Each choice item consists of a value saved in survey results and a text displayed in the UI. To construct a choice item, assign the `name` of a Dynamic Matrix or Dynamic Panel to the [`choicesFromQuestion`](#choicesFromQuestion) property and specify which dynamic panel question or matrix column supplies values and which provides texts. Use the [`choiceValuesFromQuestion`](#choiceValuesFromQuestion) and `choiceTextsFromQuestion` properties for this purpose. If a choice text is empty, a choice value is used as a display text and saved in survey results.

[View Demo](https://surveyjs.io/form-library/examples/pipe-answers-from-dynamic-matrix-or-panel/ (linkStyle))

**Type**: `string`

### `hideIfChoicesEmpty`

Specifies whether to hide the question if no choice items are visible.

This property is useful if you show or hide choice items at runtime based on a [condition](https://surveyjs.io/form-library/documentation/questionselectbase#choicesVisibleIf).

**Type**: `boolean`

### `keepIncorrectValues`

Specifies whether to keep values that cannot be assigned to this question, for example, choices unlisted in the `choices` array.

> This property cannot be specified in the survey JSON schema. Use dot notation to specify it.

**Type**: `boolean`

### `storeOthersAsComment`

**Type**: `any`

### `choicesOrder`

Specifies the sort order of choice items.

Possible values:

- `"none"` (default) - Preserves the original order of choice items.
- `"asc"`- Sorts choice items in ascending order.
- `"desc"`- Sorts choice items in ascending order.
- `"random"` - Displays choice items in random order.

**Type**: `string`

### `otherText`

Gets or sets a caption for the "Other" choice item.

**Type**: `string`

### `separateSpecialChoices`

Displays the "Select All", "None", and "Other" choices on individual rows.

[Checkboxes Demo](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/ (linkStyle))

[Radio Button Group Demo](https://surveyjs.io/form-library/examples/single-select-radio-button-group/ (linkStyle))

**Type**: `boolean`

### `otherPlaceholder`

A placeholder for the comment area. Applies when the `showOtherItem` or `showCommentArea` property is `true`.

**Type**: `string`

### `otherPlaceHolder`

**Type**: `string`

### `otherErrorText`

Gets or sets an error message displayed when users select the "Other" choice item but leave the comment area empty.

**Type**: `string`

### `visibleChoices`

An array of visible choice items. Includes the "Select All", "Other", and "None" choice items if they are visible. Items are sorted according to the `choicesOrder` value.

**Type**: `ChoiceItem[]`

### `enabledChoices`

An array of choice items with which users can interact. Includes the "Select All", "Other", and "None" choice items if they are not disabled. Items are sorted according to the `choicesOrder` value.

**Type**: `ItemValue[]`

### `newItem`

**Type**: `ItemValue`

### `isMessagePanelVisible`

**Type**: `boolean`

### `carryForwardQuestion`

**Type**: `Question`

### `showOtherItem`

Specifies whether to display the "Other" choice item.

[Dropdown Demo](https://surveyjs.io/form-library/examples/create-dropdown-menu-in-javascript/ (linkStyle))

[Checkboxes Demo](https://surveyjs.io/form-library/examples/create-checkboxes-question-in-javascript/ (linkStyle))

[Radio Button Group Demo](https://surveyjs.io/form-library/examples/single-select-radio-button-group/ (linkStyle))

**Type**: `boolean`

### `hasOther`

**Type**: `boolean`

### `requireUpdateCommentValue`

**Type**: `boolean`

### `isRunningChoicesValue`

**Type**: `boolean`

### `isFirstLoadChoicesFromUrl`

**Type**: `boolean`

### `isUpdatingChoicesDependedQuestions`

**Type**: `boolean`

### `_renderedChoices`

**Type**: `ItemValue[]`

### `onGetRenderedChoicesCallback`

**Type**: `(visibleChoices: ItemValue[]) => ItemValue[]`

### `renderedChoicesAnimation`

**Type**: `AnimationGroup<ItemValue>`

### `renderedChoices`

**Type**: `ItemValue[]`

### `headItemsCount`

**Type**: `number`

### `footItemsCount`

**Type**: `number`

### `itemSvgIcon`

**Type**: `string`

### `itemComponent`

The name of a component used to render items.

[Dropdown Demo](https://surveyjs.io/form-library/examples/dropdown-box-with-custom-items/ (linkStyle))

[Ranking Demo](https://surveyjs.io/form-library/examples/ranking-with-custom-items/ (linkStyle))

[Checkboxes and Radio Button Group Demo](https://surveyjs.io/form-library/examples/add-custom-items-to-single-and-multi-select-questions/ (linkStyle))

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `validateExpression()`

**Return value:** `IExpressionValidationResult`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `expression` | `string` |  |
| `options` | `IExpressionValidationOptions` |  |

### `dispose()`

### `supportElementsInChoice()`

**Return value:** `boolean`

### `getPanels()`

**Return value:** `IPanel[]<IPanel>`

### `getElementsInDesign()`

**Return value:** `IElement[]<IElement>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `includeHidden` | `boolean` |  |

### `getCommentTextAreaModel()`

**Return value:** `TextAreaModel`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getItemCommentId()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `createItemValue()`

**Return value:** `ChoiceItem`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `any` |  |
| `text` | `string` |  |

### `updateIsUsingRestful()`

### `supportGoNextPageError()`

**Return value:** `boolean`

### `localeChanged()`

### `locStrsChanged()`

### `supportMultipleComment()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `isCommentShowing()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getCommentValue()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `setCommentValue()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |
| `newValue` | `string` |  |

### `surveyChoiceItemVisibilityChange()`

### `addUsedLocales()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `locales` | `string[]` |  |

### `selectItem()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getItemByValue()`

**Return value:** `ItemValue`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `val` | `any` |  |
| `choices` | `ItemValue[]` |  |

### `getFilteredValue()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `isUnwrapped` | `boolean` |  |

### `setCanShowOptionItemCallback()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `func` | `(item: ItemValue) => boolean` |  |

### `isItemInList()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getPlainData()`

**Return value:** `IQuestionPlainData`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `IPlainDataOptions` |  |

### `isBuiltInChoice()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `isNoneItem()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `supportOther()`

**Return value:** `boolean`

### `supportNone()`

**Return value:** `boolean`

### `supportRefuse()`

**Return value:** `boolean`

### `supportDontKnow()`

**Return value:** `boolean`

### `setSurveyImpl()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `ISurveyImpl` |  |
| `isLight` | `boolean` |  |

### `getStoreOthersAsComment()`

**Return value:** `boolean`

### `updateValueFromSurvey()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newValue` | `any` |  |
| `clearData` | `boolean` |  |

### `randomSeedChanged()`

### `clearIncorrectValues()`

### `isItemSelected()`

Returns `true` if a passed choice item is selected.

To obtain a choice item to check, use the `noneItem` or `otherItem` property or the `choices` array.

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` | A choice item. |

### `choicesLoaded()`

### `getItemValueWrapperComponentName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getItemValueWrapperComponentData()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `ariaItemChecked()`

**Return value:** `"true" | "false"`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `isOtherItem()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getSelectBaseRootCss()`

**Return value:** `string`

### `getAriaItemLabel()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getItemId()`

**Return value:** `string`

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
