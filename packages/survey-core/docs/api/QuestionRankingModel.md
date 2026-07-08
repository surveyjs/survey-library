---
title: QuestionRankingModel
product: Form Library
api-type: class
description: "A class that describes the Ranking question type. [View Demo](https://surveyjs.io/form-library/examples/questiontype-ranking/ (linkStyle))"
source: 
---

# `QuestionRankingModel`

A class that describes the Ranking question type.

[View Demo](https://surveyjs.io/form-library/examples/questiontype-ranking/ (linkStyle))

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement` &rarr; `Question` &rarr; `QuestionSelectBase` &rarr; `QuestionCheckboxBase` &rarr; `QuestionCheckboxModel` &rarr; `QuestionRankingModel`

## Properties

### `domNode`

**Type**: `any`

### `dragOrClickHelper`

**Type**: `DragOrClickHelper<any>`

### `rootClass`

**Type**: `string`

### `ghostPositionCssClass`

**Type**: `string`

### `localeChanged`

**Type**: `() => void`

### `_rankingChoicesAnimation`

**Type**: `AnimationGroup<ItemValue>`

### `rankingChoicesAnimation`

**Type**: `AnimationGroup<ItemValue>`

### `_unRankingChoicesAnimation`

**Type**: `AnimationGroup<ItemValue>`

### `unRankingChoicesAnimation`

**Type**: `AnimationGroup<ItemValue>`

### `rankingChoices`

**Type**: `ItemValue[]`

### `unRankingChoices`

**Type**: `ItemValue[]`

### `_renderedRankingChoices`

**Type**: `ItemValue[]`

### `_renderedUnRankingChoices`

**Type**: `ItemValue[]`

### `renderedRankingChoices`

**Type**: `ItemValue[]`

### `renderedUnRankingChoices`

**Type**: `ItemValue[]`

### `dragDropRankingChoices`

**Type**: `DragDropRankingChoices`

### `currentDropTarget`

**Type**: `ItemValue`

### `draggedChoiceValue`

**Type**: `any`

### `draggedTargetNode`

**Type**: `any`

### `handlePointerDown`

**Type**: `(event: any, choice: ItemValue, node: any) => void`

### `startDrag`

**Type**: `(event: any) => void`

### `handlePointerUp`

**Type**: `(event: any, choice: ItemValue, node: any) => void`

### `handleKeydown`

**Type**: `(event: any, choice: ItemValue) => void`

### `focusItem`

**Type**: `(index: number, container?: string) => void`

### `isValueSetByUser`

**Type**: `boolean`

### `setValue`

**Type**: `() => void`

### `longTap`

Specifies whether to use a long tap (press and hold) gesture to start dragging.

Default value: `true`

Disable this property if you want to start dragging when users perform a scroll gesture.

**Type**: `boolean`

### `selectToRankEnabled`

Specifies whether users can select choices they want to rank.

When you enable this property, the Ranking question displays two areas for ranked and unranked choices. To order choices, users should first drag them from the unranked to the ranked area. Use this mode if you want to let users order only the choices they select.

Default value: `false`

[View Demo](https://surveyjs.io/form-library/examples/select-items-to-rank/ (linkStyle))

**Type**: `boolean`

### `selectToRankSwapAreas`

**Type**: `boolean`

### `carryForwardStartUnranked`

**Type**: `boolean`

### `selectToRankAreasLayout`

Specifies the layout of the ranked and unranked areas. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.

Possible values:

- `"horizontal"` (default) - The ranked and unranked areas are positioned next to each other. Users drag and drop choices between them in the horizontal direction.
- `"vertical"`- The ranked area is positioned above the unranked area. Users drag and drop choices between them in the vertical direction.

[View Demo](https://surveyjs.io/form-library/examples/select-items-to-rank/ (linkStyle))

**Type**: `string`

### `renderedSelectToRankAreasLayout`

**Type**: `string`

### `selectToRankEmptyRankedAreaText`

A placeholder displayed in the area for ranked choices. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.

**Type**: `string`

### `selectToRankEmptyUnrankedAreaText`

A placeholder displayed in the area for unranked choices. Applies when [`selectToRankEnabled`](https://surveyjs.io/form-library/documentation/api-reference/ranking-question-model#selectToRankEnabled) is `true`.

**Type**: `string`

### `useFullItemSizeForShortcut`

**Type**: `boolean`

### `dragDropSvgIcon`

**Type**: `string`

### `arrowsSvgIcon`

**Type**: `string`

### `dashSvgIcon`

**Type**: `string`

### `isNewA11yStructure`

**Type**: `boolean`

### `ariaRole`

**Type**: `string`

## Methods

### `getType()`

**Return value:** `string`

### `getItemTabIndex()`

**Return value:** `number`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getContainerClasses()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `containerType` | `string` |  |

### `getItemIndexClasses()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `item` | `ItemValue` |  |

### `getNumberByIndex()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `index` | `number` |  |

### `setSurveyImpl()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `ISurveyImpl` |  |
| `isLight` | `boolean` |  |

### `isAnswerCorrect()`

**Return value:** `boolean`

### `updateUnRankingChoices()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `newRankingChoices` | `ItemValue[]` |  |

### `checkMaxSelectedChoicesUnreached()`

**Return value:** `boolean`

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

### `supportOther()`

**Return value:** `boolean`

### `supportNone()`

**Return value:** `boolean`

### `supportRefuse()`

**Return value:** `boolean`

### `supportDontKnow()`

**Return value:** `boolean`

### `handleKeydownSelectToRank()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `event` | `any` |  |
| `movedElement` | `ItemValue` |  |
| `hardKey` | `string` |  |
| `isNeedFocus` | `boolean` |  |

### `getIconHoverCss()`

**Return value:** `string`

### `getIconFocusCss()`

**Return value:** `string`

### `isMobileMode()`

**Return value:** `boolean`
