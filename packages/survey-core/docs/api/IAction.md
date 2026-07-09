---
title: IAction
product: Form Library
api-type: interface
description: An action item.
source: https://surveyjs.io/form-library/documentation/api-reference/iaction
---

# `IAction`

An action item.

Action items are used in the Toolbar, matrix rows, titles of pages, panels, questions, and other survey elements.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

## Properties

### `action`

**Type**: `(context?: any) => void`

A function that is executed when users click the action item.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

### `active`

**Type**: `boolean`

Specifies whether the action item is active.

Use this property as a flag to specify different action item appearances in different states.

**Related APIs:** [`enabled`](#enabled), [`visible`](#visible)

### `component`

**Type**: `string`

Specifies the name of a component used to render the action item.

### `css`

**Type**: `string`

One or several CSS classes that you want to apply to the outer `<div>` element.

In the markup, an action item is rendered as an `<input>` or `<button>` wrapped in a `<div>`. The `css` property applies classes to the `<div>` element.

To apply several classes, separate them with a space character: `"myclass1 myclass2"`.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Related APIs:** [`innerCss`](#innerCss)

### `data`

**Type**: `any`

The action item's data object. Use it to pass required data to a custom template or component.

### `disableShrink`

**Type**: `boolean`

Set this property to `true` if you want the item's `title` to be always visible.
If you set it to `false`, the `title` hides when the screen space is limited, and the item displays only the icon.

**Related APIs:** [`title`](#title), [`iconName`](#iconName)

### `disableTabStop`

**Type**: `boolean`

Set this property to `true` if you want to disable keyboard navigation for the action item (sets the `tabIndex` attribute to -1).

### `enabled`

**Type**: `boolean | ComputedUpdater<boolean>`

Specifies whether users can interact with the action item.

**Related APIs:** [`active`](#active), [`visible`](#visible)

### `iconName`

**Type**: `string`

The action item's icon name.

**Related APIs:** [`iconSize`](#iconSize)

### `iconSize`

**Type**: `string | number`

The action item's icon size in pixels.

**Related APIs:** [`iconName`](#iconName)

### `id`

**Type**: `string`

A unique action item identifier.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

### `innerCss`

**Type**: `string`

One or several CSS classes that you want to apply to the inner `<input>` or `<button>` element.

In the markup, an action item is rendered as an `<input>` or `<button>` wrapped in a `<div>`. The `innerCss` property applies classes to the `<input>`/`<button>` element.

To apply several classes, separate them with a space character: `"myclass1 myclass2"`.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Related APIs:** [`css`](#css)

### `location`

**Type**: `string`

The action item's location in a matrix question's row.

The following values are available:

- `"start"` - The action item is located at the beginning of the row.
- `"end"` - The action is located at the end of the row.

### `showTitle`

**Type**: `boolean`

Specifies the visibility of the action item's title.

**Related APIs:** [`title`](#title), [`disableShrink`](#disableShrink)

### `template`

**Type**: `string`

Specifies the name of a template used to render the action item.

**Related APIs:** [`component`](#component)

### `title`

**Type**: `string`

The action item's title.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))

**Related APIs:** [`showTitle`](#showTitle), [`disableShrink`](#disableShrink)

### `tooltip`

**Type**: `string`

The action item's tooltip.

### `visible`

**Type**: `boolean | ComputedUpdater<boolean>`

Specifies the action item's visibility.

**Related APIs:** [`enabled`](#enabled), [`active`](#active)

### `visibleIndex`

**Type**: `number`

A number that specifies the action's position relative to other actions.

[View Demo](https://surveyjs.io/form-library/examples/add-custom-navigation-button/ (linkStyle))
