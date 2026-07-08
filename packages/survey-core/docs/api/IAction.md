---
title: IAction
product: Form Library
api-type: interface
description: "An action item. Action items are used in the Toolbar, matrix rows, titles of pages, panels, questions, and other survey elements. [View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))"
source: 
---

# `IAction`

An action item.

Action items are used in the Toolbar, matrix rows, titles of pages, panels, questions, and other survey elements.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

## Properties

### `id`

A unique action item identifier.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Type**: `string`

### `visible`

Specifies the action item's visibility.

**Type**: `boolean | ComputedUpdater<boolean>`

### `title`

The action item's title.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Type**: `string`

### `titles`

**Type**: `{ [locale: string]: string; }`

### `locTitle`

**Type**: `LocalizableString`

### `locTitleName`

**Type**: `string`

### `tooltip`

The action item's tooltip.

**Type**: `string`

### `locTooltipName`

**Type**: `string`

### `enabled`

Specifies whether users can interact with the action item.

**Type**: `boolean | ComputedUpdater<boolean>`

### `enabledIf`

**Type**: `() => boolean`

### `showTitle`

Specifies the visibility of the action item's title.

**Type**: `boolean`

### `action`

A function that is executed when users click the action item.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Type**: `(context?: any) => void`

### `onFocus`

**Type**: `(isMouse: boolean, event: any) => void`

### `css`

One or several CSS classes that you want to apply to the outer `<div>` element.

In the markup, an action item is rendered as an `<input>` or `<button>` wrapped in a `<div>`. The `css` property applies classes to the `<div>` element.

To apply several classes, separate them with a space character: `"myclass1 myclass2"`.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Type**: `string`

### `innerCss`

One or several CSS classes that you want to apply to the inner `<input>` or `<button>` element.

In the markup, an action item is rendered as an `<input>` or `<button>` wrapped in a `<div>`. The `innerCss` property applies classes to the `<input>`/`<button>` element.

To apply several classes, separate them with a space character: `"myclass1 myclass2"`.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Type**: `string`

### `data`

The action item's data object. Use it to pass required data to a custom template or component.

**Type**: `any`

### `popupModel`

**Type**: `any`

### `needSeparator`

**Type**: `boolean`

### `active`

Specifies whether the action item is active.

Use this property as a flag to specify different action item appearances in different states.

**Type**: `boolean`

### `pressed`

**Type**: `boolean`

### `template`

Specifies the name of a template used to render the action item.

**Type**: `string`

### `component`

Specifies the name of a component used to render the action item.

**Type**: `string`

### `iconName`

The action item's icon name.

**Type**: `string`

### `iconSize`

The action item's icon size in pixels.

**Type**: `string | number`

### `location`

The action item's location in a matrix question's row.

The following values are available:

- `"start"` - The action item is located at the beginning of the row.
- `"end"` - The action is located at the end of the row.

**Type**: `string`

### `disableTabStop`

Set this property to `true` if you want to disable keyboard navigation for the action item (sets the `tabIndex` attribute to -1).

**Type**: `boolean`

### `disableShrink`

Set this property to `true` if you want the item's `title` to be always visible.
If you set it to `false`, the `title` hides when the screen space is limited, and the item displays only the icon.

**Type**: `boolean`

### `disableHide`

**Type**: `boolean`

### `mode`

**Type**: `"large" | "small" | "popup" | "removed"`

### `visibleIndex`

A number that specifies the action's position relative to other actions.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Type**: `number`

### `needSpace`

**Type**: `boolean`

### `ariaChecked`

**Type**: `boolean`

### `ariaExpanded`

**Type**: `boolean`

### `ariaLabelledBy`

**Type**: `string`

### `ariaRole`

**Type**: `string`

### `elementId`

**Type**: `string`

### `items`

**Type**: `IAction[]`

### `markerIconName`

**Type**: `string`

### `showPopup`

**Type**: `() => void`

### `hidePopup`

**Type**: `() => void`
