---
title: SurveyElement
product: Form Library
api-type: class
description: A base class for all survey elements.
source: 
---

# `SurveyElement`

A base class for all survey elements.

## Inheritance

`Base` &rarr; `SurveyElementCore` &rarr; `SurveyElement`

## Properties

### `stateChangedCallback`

**Type**: `() => void`

### `surveyImplValue`

**Type**: `ISurveyImpl`

### `surveyDataValue`

**Type**: `ISurveyData`

### `surveyValue`

**Type**: `ISurvey`

### `textProcessorValue`

**Type**: `ITextProcessor`

### `selectedElementInDesignValue`

**Type**: `SurveyElement<any>`

### `readOnlyChangedCallback`

**Type**: `() => void`

### `effectiveColSpan`

**Type**: `number`

### `colSpan`

Specifies how many columns this survey element spans in the grid layout. Applies only if you set the `SurveyModel`'s [`gridLayoutEnabled`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#gridLayoutEnabled) property to `true` and define the [`gridLayoutColumns`](https://surveyjs.io/form-library/documentation/api-reference/page-model#gridLayoutColumns) array for the parent page or panel.

Default value: 1

**Type**: `number`

### `parentQuestionValue`

**Type**: `E`

### `parentQuestion`

A Dynamic Panel, Dynamic Matrix, or Dropdown Matrix that includes the current question.

This property is `null` for standalone questions.

**Type**: `E`

### `skeletonComponentName`

**Type**: `string`

### `state`

Gets and sets the survey element's expand state.

Possible values:

- `"default"` (default) - The survey element is displayed in full and cannot be collapsed in the UI.
- `"expanded"` - The survey element is displayed in full and can be collapsed in the UI.
- `"collapsed"` - The survey element displays only `title` and `description` and can be expanded in the UI.

[View Demo](https://surveyjs.io/form-library/examples/set-properties-on-multiple-questions-using-panel/ (linkStyle))

**Type**: `string`

### `isCollapsed`

Returns `true` if the survey element is collapsed.

**Type**: `boolean`

### `isExpanded`

Returns `true` if the survey element is expanded.

**Type**: `boolean`

### `hasStateButton`

**Type**: `boolean`

### `uiState`

**Type**: `IElementUIState`

### `shortcutText`

**Type**: `string`

### `titleToolbarValue`

**Type**: `AdaptiveActionContainer<Action>`

### `titleActions`

**Type**: `any[]`

### `isTitleActionRequested`

**Type**: `boolean`

### `hasTitleActions`

**Type**: `boolean`

### `hasTitleEvents`

**Type**: `boolean`

### `titleTabIndex`

**Type**: `number`

### `titleAriaExpanded`

**Type**: `any`

### `titleAriaRole`

**Type**: `any`

### `data`

**Type**: `ISurveyData`

### `survey`

Returns the survey object.

**Type**: `ISurvey`

### `titleSettings`

**Type**: `ISurveyTitleSettings`

### `lifecycleCallbacks`

**Type**: `ISurveyElementLifecycle`

### `cssCallbacks`

**Type**: `ISurveyCssCallbacks`

### `singleInput`

**Type**: `ISurveySingleInput`

### `skeletonHeight`

**Type**: `string`

### `isContentElement`

**Type**: `boolean`

### `isEditableTemplateElement`

**Type**: `boolean`

### `isInteractiveDesignElement`

**Type**: `boolean`

### `areInvisibleElementsShowing`

**Type**: `boolean`

### `isVisible`

**Type**: `boolean`

### `isReadOnly`

Returns `true` if the survey element or its parent element is read-only.

If you want to switch a survey element to the read-only state based on a condition, specify the [`enableIf`](https://surveyjs.io/form-library/documentation/question#enableIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `boolean`

### `readOnly`

Makes the survey element read-only.

If you want to switch a survey element to the read-only state based on a condition, specify the [`enableIf`](https://surveyjs.io/form-library/documentation/question#enableIf) property. Refer to the following help topic for information: [Conditional Visibility](https://surveyjs.io/form-library/documentation/design-survey-conditional-logic#conditional-visibility).

**Type**: `boolean`

### `cssClassesValue`

**Type**: `any`

### `isCalculatingCssClasses`

**Type**: `boolean`

### `cssClasses`

Returns an object in which keys are UI elements and values are CSS classes applied to them.

Use the following events of the [`SurveyModel`](https://surveyjs.io/form-library/documentation/surveymodel) object to override CSS classes:

- [`onUpdateQuestionCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdateQuestionCssClasses)
- [`onUpdatePanelCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdatePanelCssClasses)
- [`onUpdatePageCssClasses`](https://surveyjs.io/form-library/documentation/surveymodel#onUpdatePageCssClasses)
- [`onUpdateChoiceItemCss`](https://surveyjs.io/form-library/documentation/api-reference/survey-data-model#onUpdateChoiceItemCss)

[View Demo](https://surveyjs.io/form-library/examples/customize-survey-with-css/ (linkStyle))

**Type**: `any`

### `cssTitleNumber`

**Type**: `any`

### `cssRequiredMark`

**Type**: `any`

### `cssError`

**Type**: `string`

### `name`

A survey element identifier.

> Question names must be unique.

**Type**: `string`

### `errors`

Validation errors. Call the `validate()` method to validate survey element data.

**Type**: `SurveyError[]`

### `renderedErrors`

**Type**: `SurveyError[]`

### `currentNotificationType`

**Type**: `string`

### `hasVisibleErrors`

**Type**: `boolean`

### `containsErrors`

Returns `true` if the survey element or its child elements have validation errors.

This property contains the result of the most recent validation. This result may be outdated. Call the `validate` method to get an up-to-date value.

**Type**: `boolean`

### `selectedElementInDesign`

**Type**: `SurveyElement<any>`

### `wasRenderedValue`

**Type**: `boolean`

### `wasRendered`

**Type**: `boolean`

### `locOwner`

**Type**: `ILocalizableOwner`

### `parent`

**Type**: `IPanel`

### `hasParent`

**Type**: `boolean`

### `isSingleInRow`

**Type**: `boolean`

### `isInternalNested`

**Type**: `boolean`

### `width`

Sets survey element width in CSS values.

Default value: ""

**Type**: `string`

### `minWidth`

Gets or sets minimum survey element width in CSS values.

Default value: "300px" (taken from [`settings.minWidth`](https://surveyjs.io/form-library/documentation/settings#minWidth))

**Type**: `string`

### `maxWidth`

Gets or sets maximum survey element width in CSS values.

Default value: "100%" (taken from [`settings.maxWidth`](https://surveyjs.io/form-library/documentation/settings#maxWidth))

**Type**: `string`

### `renderWidth`

Returns a calculated width of the rendered survey element in CSS values.

**Type**: `string`

### `indent`

Increases or decreases an indent of survey element content from the left edge. Accepts positive integer values and 0.

**Type**: `number`

### `rightIndent`

**Type**: `number`

### `allowRootStyle`

**Type**: `boolean`

### `rootStyle`

**Type**: `any`

### `clickTitleFunction`

**Type**: `any`

### `hasAdditionalTitleToolbar`

**Type**: `boolean`

### `additionalTitleToolbar`

**Type**: `ActionContainer<Action>`

### `isDisabledStyle`

**Type**: `boolean`

### `isReadOnlyStyle`

**Type**: `boolean`

### `isPreviewStyle`

**Type**: `boolean`

### `wrapperElement`

**Type**: `any`

### `_renderedIsExpanded`

**Type**: `boolean`

### `_isAnimatingCollapseExpand`

**Type**: `boolean`

### `animationCollapsed`

**Type**: `AnimationBoolean`

### `renderedIsExpanded`

**Type**: `boolean`

### `randomSeed`

**Type**: `number`

## Methods

### `getProgressInfoByElements()`

**Return value:** `IProgressInfo`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `children` | `SurveyElement<any>[]` |  |
| `isRequired` | `boolean` |  |

### `ScrollIntoView()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |
| `scrollIntoViewOptions` | `any` |  |
| `doneCallback` | `() => void` |  |

### `ScrollElementToTop()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `any` |  |
| `scrollIfVisible` | `boolean` |  |
| `scrollIntoViewOptions` | `any` |  |
| `doneCallback` | `() => void` |  |

### `ScrollElementToViewCore()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `el` | `any` |  |
| `checkLeft` | `boolean` |  |
| `scrollIfVisible` | `boolean` |  |
| `scrollIntoViewOptions` | `any` |  |
| `doneCallback` | `() => void` |  |

### `GetFirstNonTextElement()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `elements` | `any` |  |
| `removeSpaces` | `boolean` |  |

### `FocusElement()`

**Return value:** `boolean`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `elementId` | `string` |  |
| `isTimeOut` | `boolean` |  |
| `containerEl` | `any` |  |

### `getPanelInDesignMode()`

**Return value:** `PanelModel`

### `updateElementVisibility()`

### `collapse()`

Collapses the survey element.

In collapsed state, the element displays only `title` and `description`.

### `expand()`

Expands the survey element.

### `toggleState()`

Toggles the survey element's `state` between collapsed and expanded.

**Return value:** `boolean`

### `getTitleToolbar()`

**Return value:** `AdaptiveActionContainer<Action>`

### `getTitleActions()`

**Return value:** `any[]<any>`

### `locStrsChanged()`

### `setSurveyImpl()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `value` | `ISurveyImpl` |  |
| `isLight` | `boolean` |  |

### `getValueGetterContext()`

**Return value:** `IValueGetterContext`

### `getDataFilteredProperties()`

**Return value:** `any`

### `getSurvey()`

**Return value:** `ISurvey`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `live` | `boolean` |  |

### `getCssTitleExpandableSvg()`

**Return value:** `string`

### `updateElementCss()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `reNew` | `boolean` |  |

### `calcRenderedErrors()`

**Return value:** `SurveyError[]<SurveyError>`

### `updateContainsErrors()`

### `updateCustomWidgets()`

### `onSurveyLoad()`

### `onFirstRendering()`

### `setVisibleIndex()`

**Return value:** `number`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `index` | `number` |  |

### `delete()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `doDispose` | `boolean` |  |

### `getLocale()`

Returns the survey's [locale](https://surveyjs.io/form-library/documentation/surveymodel#locale).

If a default locale is used, this method returns an empty string. To get the applied locale in this case, use the following code:

```js
import { surveyLocalization } from 'survey-core';
const defaultLocale = surveyLocalization.defaultLocale;
```

**Return value:** `string`

### `getMarkdownHtml()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |
| `name` | `string` |  |
| `item` | `any` |  |

### `getRenderer()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `name` | `string` |  |
| `item` | `ItemValue` |  |

### `getRendererContext()`

**Return value:** `any`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `locStr` | `LocalizableString` |  |
| `item` | `ItemValue` |  |

### `getProcessedText()`

**Return value:** `string`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `text` | `string` |  |
| `context` | `any` |  |

### `getRootStyle()`

**Return value:** `object`

### `updateRootStyle()`

### `localeChanged()`

### `setWrapperElement()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `any` |  |

### `getWrapperElement()`

**Return value:** `HTMLElement`

### `afterRenderCore()`

**Parameters:**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `element` | `any` |  |

### `dispose()`

### `randomSeedChanged()`

### `ensureRowsVisibility()`
