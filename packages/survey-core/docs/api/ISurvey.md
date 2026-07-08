---
title: ISurvey
product: Form Library
api-type: interface
description: "The main survey interface, composed from focused sub-interfaces. Consumers that only need a subset of survey functionality can depend on the narrower sub-interfaces (e.g. `ISurveyFileCallbacks`, `ISurveyMatrixCallbacks`) instead of the full `ISurvey`."
source: 
---

# `ISurvey`

The main survey interface, composed from focused sub-interfaces.

Consumers that only need a subset of survey functionality can depend on the
narrower sub-interfaces (e.g. `ISurveyFileCallbacks`, `ISurveyMatrixCallbacks`)
instead of the full `ISurvey`.

## Inheritance

`ISurveySingleInput` &rarr; `ISurveyValidation` &rarr; `ISurveyTitleSettings` &rarr; `ISurveyAfterRenderCallbacks` &rarr; `ISurveyCssCallbacks` &rarr; `ISurveyChoiceCallbacks` &rarr; `ISurveyDynamicPanelCallbacks` &rarr; `ISurveyMatrixCallbacks` &rarr; `ISurveyFileCallbacks` &rarr; `ISurveyElementLifecycle` &rarr; `ISurvey`

## Properties

### `currentPage`

**Type**: `IPage`

### `activePage`

**Type**: `IPage`

### `pages`

**Type**: `IPage[]`

### `state`

**Type**: `string`

### `locEditText`

**Type**: `LocalizableString`

### `cssNavigationEdit`

**Type**: `string`

### `keepIncorrectValues`

**Type**: `boolean`

### `questionOrder`

**Type**: `string`

### `gridLayoutEnabled`

**Type**: `boolean`

### `isLazyRendering`

**Type**: `boolean`

### `lazyRenderFirstBatchSize`

**Type**: `number`

### `rootElement`

**Type**: `any`

### `isDisplayMode`

**Type**: `boolean`

### `isDesignMode`

**Type**: `boolean`

### `isLoadingFromJson`

**Type**: `boolean`

### `isEditingSurveyElement`

**Type**: `boolean`

### `areInvisibleElementsShowing`

**Type**: `boolean`

### `areEmptyElementsHidden`

**Type**: `boolean`

### `isUpdateValueTextOnTyping`

**Type**: `boolean`

### `autoGrowComment`

**Type**: `boolean`

### `allowResizeComment`

**Type**: `boolean`

### `commentAreaRows`

**Type**: `number`

### `maxTextLength`

**Type**: `number`

### `maxCommentLength`

**Type**: `number`

### `timeLimitPerPage`

**Type**: `number`

### `randomSeed`

**Type**: `number`

## Methods

### `isPageStarted()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `page` | `IPage` |  |

### `cancelPreviewByPage()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `panel` | `IPanel` |  |

### `getQuestionByName()`

**Return value:** `IQuestion`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |

### `getQuestionsByValueName()`

**Return value:** `IQuestion[]<IQuestion>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `valueName` | `string` |  |

### `questionsByValueName()`

**Return value:** `IQuestion[]<IQuestion>`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `valueName` | `string` |  |

### `hasVisibleQuestionByValueName()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |

### `getQuestionByValueNameFromArray()`

**Return value:** `IQuestion`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `valueName` | `string` |  |
| `name` | `string` |  |
| `index` | `number` |  |

### `focusQuestionByInstance()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `onError` | `boolean` |  |

### `questionValueChanging()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `newValue` | `any` |  |
| `isComment` | `boolean` |  |

### `questionValueChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `oldValue` | `any` |  |
| `isComment` | `boolean` |  |

### `getQuestionClearIfInvisible()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `questionClearIf` | `string` |  |

### `getSkeletonComponentName()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `ISurveyElement` |  |

### `getCss()`

**Return value:** `any`

### `processHtml()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `html` | `string` |  |
| `reason` | `string` |  |

### `getSurveyMarkdownHtml()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `Base` |  |
| `text` | `string` |  |
| `name` | `string` |  |
| `item` | `any` |  |

### `getRendererForString()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `Base` |  |
| `name` | `string` |  |
| `item` | `ItemValue` |  |

### `getRendererContextForString()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `Base` |  |
| `locStr` | `LocalizableString` |  |
| `item` | `ItemValue` |  |

### `isSettingData()`

**Return value:** `boolean`

### `getSurveyErrorCustomText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `Base` |  |
| `text` | `string` |  |
| `error` | `SurveyError` |  |

### `runExpression()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `expression` | `string` |  |
| `callback` | `(res: any) => void` |  |

### `beforeExpressionRunning()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `obj` | `Base` |  |
| `propertyName` | `string` |  |
| `expression` | `string` |  |

### `startSetValueOnExpression()`

### `finishSetValueOnExpression()`

### `multipleTextItemAdded()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `item` | `any` |  |

### `onCorrectQuestionAnswer()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `any` |  |

### `processPopupVisiblityChanged()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `popupModel` | `PopupModel<any>` |  |
| `visible` | `boolean` |  |

### `processOpenDropdownMenu()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `question` | `IQuestion` |  |
| `options` | `IDropdownMenuOptions` |  |

### `dragAndDropAllow()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `DragDropAllowEvent` |  |

### `scrollElementToTop()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `options` | `IScrollElementToTopOptions` |  |

### `scrollElementToTop()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `ISurveyElement` |  |
| `question` | `IQuestion` |  |
| `page` | `IPage` |  |
| `id` | `string` |  |
| `scrollIfVisible` | `boolean` |  |
| `scrollIntoViewOptions` | `any` |  |
| `passedRootElement` | `any` |  |
| `onScolledCallback` | `() => void` |  |
